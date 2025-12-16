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
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const chat_repository_1 = require("../repository/chat.repository");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const mongoose_3 = require("mongoose");
const user_schema_1 = require("../../auth/schemas/user.schema");
let ChatService = class ChatService {
    constructor(chatRepository, userModel) {
        this.chatRepository = chatRepository;
        this.userModel = userModel;
    }
    async createMessage(createMessageDto, senderId, senderRole) {
        console.log('ChatService: Creating message', {
            senderId,
            senderRole,
            receiverId: createMessageDto.receiverId,
            content: createMessageDto.content,
        });
        const message = await this.chatRepository.createMessage({
            senderId: new mongoose_1.Types.ObjectId(senderId),
            receiverId: new mongoose_1.Types.ObjectId(createMessageDto.receiverId),
            content: createMessageDto.content,
            senderRole,
            isRead: false,
        });
        console.log('ChatService: Message created, fetching all messages', {
            messageId: message._id,
        });
        const allMessages = await this.chatRepository.getMessagesBetweenUsers(senderId, createMessageDto.receiverId);
        console.log('ChatService: Retrieved messages', {
            messageCount: allMessages?.length || 0,
        });
        return allMessages;
    }
    async getMessages(userId, otherUserId) {
        if (otherUserId === 'ai-assistant' || otherUserId.toLowerCase() === 'ai') {
            return [];
        }
        return this.chatRepository.getMessagesBetweenUsers(userId, otherUserId);
    }
    async markAsRead(senderId, receiverId) {
        return this.chatRepository.markMessagesAsRead(senderId, receiverId);
    }
    async getUnreadCount(userId) {
        return this.chatRepository.getUnreadCount(userId);
    }
    async getConversations(userId, userRole) {
        console.log('ChatService: getConversations called', { userId, userRole });
        const result = await this.chatRepository.getAllConversationsForUser(userId, userRole);
        console.log('ChatService: getConversations result count:', result?.length || 0);
        return result;
    }
    async getAdminUser() {
        const admin = await this.userModel.findOne({ role: 'admin' });
        if (!admin) {
            throw new Error('Admin user not found');
        }
        return {
            _id: admin._id,
            displayName: admin.displayName,
            avaUrl: admin.avaUrl,
            role: admin.role,
        };
    }
    async getUserById(userId) {
        return this.userModel.findById(userId).exec();
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, mongoose_2.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [chat_repository_1.ChatRepository,
        mongoose_3.Model])
], ChatService);
//# sourceMappingURL=chat.service.js.map