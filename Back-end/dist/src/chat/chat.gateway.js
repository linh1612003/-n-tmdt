"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const jwt_1 = require("@nestjs/jwt");
const common_1 = require("@nestjs/common");
const chat_service_1 = require("./services/chat.service");
const chatbot_service_1 = require("./services/chatbot.service");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../auth/schemas/user.schema");
let ChatGateway = class ChatGateway {
    constructor(chatService, chatbotService, jwtService, userModel) {
        this.chatService = chatService;
        this.chatbotService = chatbotService;
        this.jwtService = jwtService;
        this.userModel = userModel;
        this.connectedUsers = new Map();
    }
    async handleConnection(client) {
        try {
            const token = client.handshake.auth.token;
            if (!token) {
                console.error('Connection error: No token provided');
                client.emit('error', { message: 'Token is required' });
                client.disconnect();
                return;
            }
            const secret = process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET;
            if (!secret) {
                console.error('Connection error: No JWT secret configured');
                client.emit('error', { message: 'Server configuration error' });
                client.disconnect();
                return;
            }
            const decoded = await this.jwtService.verifyAsync(token, {
                secret: secret,
            });
            const user = await this.userModel.findById(decoded.userId);
            if (!user) {
                console.error('Connection error: User not found');
                client.emit('error', { message: 'User not found' });
                client.disconnect();
                return;
            }
            const userIdString = decoded.userId.toString();
            client.data.userId = userIdString;
            client.data.userRole = user.role;
            this.connectedUsers.set(userIdString, client.id);
            this.server.emit('userOnline', {
                userId: userIdString,
                isOnline: true,
            });
            console.log(`User ${userIdString} connected (role: ${user.role})`);
            console.log('ChatGateway: Connected users:', Array.from(this.connectedUsers.keys()));
            client.emit('connectionReady', {
                userId: userIdString,
                userRole: user.role,
            });
        }
        catch (error) {
            console.error('Connection error:', error);
            if (error.name === 'TokenExpiredError') {
                client.emit('error', {
                    message: 'Token expired',
                    code: 'TOKEN_EXPIRED'
                });
            }
            else if (error.name === 'JsonWebTokenError') {
                client.emit('error', {
                    message: 'Invalid token',
                    code: 'INVALID_TOKEN'
                });
            }
            else {
                client.emit('error', {
                    message: error.message || 'Connection failed',
                    code: 'CONNECTION_ERROR'
                });
            }
            client.disconnect();
        }
    }
    async handleDisconnect(client) {
        if (client.data.userId) {
            this.connectedUsers.delete(client.data.userId);
            this.server.emit('userOnline', {
                userId: client.data.userId,
                isOnline: false,
            });
            console.log(`User ${client.data.userId} disconnected`);
        }
    }
    async handleMessage(data, client) {
        try {
            const senderId = client.data.userId;
            const senderRole = client.data.userRole;
            console.log('ChatGateway: Received sendMessage', {
                senderId,
                senderRole,
                receiverId: data.receiverId,
                content: data.content,
            });
            if (!senderId || !data.receiverId || !data.content) {
                console.error('ChatGateway: Missing required fields', {
                    senderId,
                    receiverId: data.receiverId,
                    content: data.content,
                });
                client.emit('error', { message: 'Missing required fields' });
                return;
            }
            const receiverIdString = data.receiverId.toString();
            const messages = await this.chatService.createMessage({
                receiverId: receiverIdString,
                content: data.content,
            }, senderId, senderRole);
            console.log('ChatGateway: Message saved successfully', {
                messageCount: messages?.length || 0,
            });
            console.log('ChatGateway: Emitting newMessage to sender', {
                senderId,
                socketId: client.id,
                messageCount: messages?.length || 0,
            });
            client.emit('newMessage', messages);
            const receiverSocketId = this.connectedUsers.get(receiverIdString);
            console.log('ChatGateway: Looking for receiver', {
                receiverId: data.receiverId,
                receiverIdString: receiverIdString,
                connectedUsers: Array.from(this.connectedUsers.keys()),
                found: !!receiverSocketId,
            });
            if (receiverSocketId) {
                console.log('ChatGateway: Sending message to receiver', {
                    receiverId: receiverIdString,
                    socketId: receiverSocketId,
                });
                this.server.to(receiverSocketId).emit('newMessage', messages);
            }
            else {
                console.log('ChatGateway: Receiver not online', {
                    receiverId: receiverIdString,
                    availableUsers: Array.from(this.connectedUsers.keys()),
                });
            }
            if (senderRole === 'member' || senderRole === 'user') {
                try {
                    const receiver = await this.userModel.findById(receiverIdString);
                    if (receiver && receiver.role === 'admin') {
                        setTimeout(async () => {
                            await this.handleChatbotResponse(senderId, data.content);
                        }, 500);
                    }
                }
                catch (error) {
                    console.error('ChatGateway: Error checking receiver role:', error);
                }
            }
            return messages;
        }
        catch (error) {
            console.error('ChatGateway: Error sending message:', error);
            console.error('ChatGateway: Error stack:', error.stack);
            client.emit('error', {
                message: 'Failed to send message',
                error: error.message,
            });
        }
    }
    async handleChatbotResponse(userId, userMessage) {
        try {
            console.log('ChatGateway: Processing chatbot response', { userId, userMessage });
            const chatbotResponse = await this.chatbotService.processMessage(userId, userMessage);
            if (!chatbotResponse) {
                console.log('ChatGateway: No chatbot response');
                return;
            }
            const adminInfo = await this.chatService.getAdminUser();
            const adminId = adminInfo._id.toString();
            const chatbotMessages = await this.chatService.createChatbotMessage({
                receiverId: userId,
                content: chatbotResponse.content,
                quickReplies: chatbotResponse.quickReplies,
                metadata: chatbotResponse.metadata,
            }, adminId);
            console.log('ChatGateway: Chatbot message created', {
                messageCount: chatbotMessages?.length || 0,
            });
            const userSocketId = this.connectedUsers.get(userId);
            if (userSocketId) {
                this.server.to(userSocketId).emit('newMessage', chatbotMessages);
            }
            if (chatbotResponse.metadata?.handoffRequested) {
                const adminSocketId = this.connectedUsers.get(adminId);
                if (adminSocketId) {
                    this.server.to(adminSocketId).emit('handoffRequested', {
                        userId,
                        message: userMessage,
                    });
                }
            }
        }
        catch (error) {
            console.error('ChatGateway: Error handling chatbot response:', error);
        }
    }
    async handleQuickReply(data, client) {
        try {
            const senderId = client.data.userId;
            const senderRole = client.data.userRole;
            console.log('ChatGateway: Received quickReply', {
                senderId,
                senderRole,
                payload: data.payload,
            });
            const payloadToMessage = {
                'CHECK_ORDER': 'Kiểm tra đơn hàng',
                'VIEW_PRODUCTS': 'Xem sản phẩm',
                'RETURN_POLICY': 'Chính sách đổi trả',
                'HANDOFF': 'Gặp nhân viên',
                'ORDER_TRACKING': 'Theo dõi vận chuyển',
                'CONTACT_SUPPORT': 'Liên hệ CSKH',
                'WARRANTY_POLICY': 'Chính sách bảo hành',
            };
            const messageContent = payloadToMessage[data.payload] || data.payload;
            const adminInfo = await this.chatService.getAdminUser();
            const adminId = adminInfo._id.toString();
            await this.handleMessage({
                receiverId: adminId,
                content: messageContent,
            }, client);
        }
        catch (error) {
            console.error('ChatGateway: Error handling quick reply:', error);
            client.emit('error', {
                message: 'Failed to process quick reply',
                error: error.message,
            });
        }
    }
    async handleJoinRoom(data, client) {
        const userId = client.data.userId;
        const otherUserIdString = data.otherUserId?.toString();
        console.log('ChatGateway: joinRoom called', { userId, otherUserId: data.otherUserId, otherUserIdString });
        if (!userId) {
            console.error('ChatGateway: joinRoom - userId not found in client.data');
            client.emit('error', { message: 'User ID not found' });
            return;
        }
        if (!otherUserIdString) {
            console.error('ChatGateway: joinRoom - otherUserId not provided');
            client.emit('error', { message: 'Other user ID not provided' });
            return;
        }
        const roomId = this.getRoomId(userId, otherUserIdString);
        client.join(roomId);
        console.log('ChatGateway: User joined room', { userId, otherUserId: otherUserIdString, roomId });
        console.log('ChatGateway: Loading messages for', { userId, otherUserId: otherUserIdString });
        const messages = await this.chatService.getMessages(userId, otherUserIdString);
        console.log('ChatGateway: Loaded messages count:', messages?.length || 0);
        client.emit('messageHistory', messages);
        await this.chatService.markAsRead(otherUserIdString, userId);
    }
    async handleMarkAsRead(data, client) {
        const receiverId = client.data.userId;
        await this.chatService.markAsRead(data.senderId, receiverId);
        const senderSocketId = this.connectedUsers.get(data.senderId);
        if (senderSocketId) {
            this.server.to(senderSocketId).emit('messagesRead', {
                receiverId,
            });
        }
    }
    getRoomId(userId1, userId2) {
        return [userId1, userId2].sort().join('-');
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('sendMessage'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('quickReply'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleQuickReply", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinRoom'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleJoinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('markAsRead'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleMarkAsRead", null);
exports.ChatGateway = ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: 'http://localhost:3000',
            credentials: true,
        },
        namespace: '/chat',
    }),
    (0, common_1.Injectable)(),
    __param(3, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [chat_service_1.ChatService,
        chatbot_service_1.ChatbotService,
        jwt_1.JwtService,
        mongoose_2.Model])
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map