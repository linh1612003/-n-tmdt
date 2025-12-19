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
exports.ChatRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const message_schema_1 = require("../schema/message.schema");
const mongoose_3 = require("mongoose");
let ChatRepository = class ChatRepository {
    constructor(messageModel) {
        this.messageModel = messageModel;
    }
    async createMessage(messageData) {
        console.log('ChatRepository: Creating message', messageData);
        const message = new this.messageModel(messageData);
        const savedMessage = await message.save();
        console.log('ChatRepository: Message saved to database', {
            messageId: savedMessage._id,
            senderId: savedMessage.senderId,
            receiverId: savedMessage.receiverId,
            content: savedMessage.content,
        });
        return savedMessage;
    }
    async getMessagesBetweenUsers(userId1, userId2) {
        if (userId1 === 'ai-assistant' || userId1.toLowerCase() === 'ai' ||
            userId2 === 'ai-assistant' || userId2.toLowerCase() === 'ai') {
            return [];
        }
        const messages = await this.messageModel
            .find({
            $or: [
                {
                    senderId: new mongoose_3.Types.ObjectId(userId1),
                    receiverId: new mongoose_3.Types.ObjectId(userId2),
                },
                {
                    senderId: new mongoose_3.Types.ObjectId(userId2),
                    receiverId: new mongoose_3.Types.ObjectId(userId1),
                },
            ],
        })
            .sort({ createdAt: 1 })
            .populate('senderId', 'displayName avaUrl role')
            .populate('receiverId', 'displayName avaUrl role')
            .exec();
        return messages.map((msg) => {
            if (msg.senderId) {
                const senderObj = msg.senderId.toObject ? msg.senderId.toObject() : msg.senderId;
                if (msg.senderRole === 'chatbot') {
                    msg.senderId = {
                        ...senderObj,
                        displayName: 'Chatbot',
                        role: 'chatbot',
                    };
                }
                else if (senderObj.role === 'admin') {
                    msg.senderId = {
                        ...senderObj,
                        displayName: 'Admin',
                    };
                }
            }
            return msg;
        });
    }
    async markMessagesAsRead(senderId, receiverId) {
        await this.messageModel.updateMany({
            senderId: new mongoose_3.Types.ObjectId(senderId),
            receiverId: new mongoose_3.Types.ObjectId(receiverId),
            isRead: false,
        }, { isRead: true });
    }
    async getUnreadCount(receiverId) {
        return this.messageModel.countDocuments({
            receiverId: new mongoose_3.Types.ObjectId(receiverId),
            isRead: false,
        });
    }
    async getAllConversationsForUser(userId, userRole) {
        console.log('ChatRepository: getAllConversationsForUser', { userId, userRole });
        let matchCondition = {
            $or: [
                { senderId: new mongoose_3.Types.ObjectId(userId) },
                { receiverId: new mongoose_3.Types.ObjectId(userId) },
            ],
        };
        console.log('ChatRepository: Match condition', JSON.stringify(matchCondition, null, 2));
        const totalMessages = await this.messageModel.countDocuments(matchCondition);
        console.log('ChatRepository: Total messages matching condition:', totalMessages);
        const conversations = await this.messageModel.aggregate([
            {
                $match: matchCondition,
            },
            {
                $sort: { createdAt: -1 },
            },
            {
                $group: {
                    _id: {
                        $cond: [
                            { $eq: ['$senderId', new mongoose_3.Types.ObjectId(userId)] },
                            '$receiverId',
                            '$senderId',
                        ],
                    },
                    lastMessage: { $first: '$$ROOT' },
                    unreadCount: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        { $eq: ['$receiverId', new mongoose_3.Types.ObjectId(userId)] },
                                        { $eq: ['$isRead', false] },
                                    ],
                                },
                                1,
                                0,
                            ],
                        },
                    },
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'user',
                },
            },
            {
                $unwind: {
                    path: '$user',
                    preserveNullAndEmptyArrays: false,
                },
            },
            {
                $match: userRole === 'admin'
                    ? { 'user.role': { $ne: 'admin' } }
                    : { 'user.role': 'admin' },
            },
            {
                $project: {
                    userId: '$_id',
                    displayName: userRole === 'admin'
                        ? '$user.displayName'
                        : 'Admin',
                    avaUrl: '$user.avaUrl',
                    lastMessage: {
                        content: '$lastMessage.content',
                        createdAt: '$lastMessage.createdAt',
                        senderId: '$lastMessage.senderId',
                    },
                    unreadCount: 1,
                },
            },
            {
                $sort: { 'lastMessage.createdAt': -1 },
            },
        ]);
        console.log('ChatRepository: Found conversations', conversations.length);
        if (conversations.length > 0) {
            console.log('ChatRepository: First conversation sample:', JSON.stringify(conversations[0], null, 2));
        }
        else {
            const allMessages = await this.messageModel.find(matchCondition).limit(5).exec();
            console.log('ChatRepository: Sample messages (first 5):', allMessages.map(m => ({
                _id: m._id,
                senderId: m.senderId,
                receiverId: m.receiverId,
                content: m.content,
            })));
        }
        return conversations;
    }
};
exports.ChatRepository = ChatRepository;
exports.ChatRepository = ChatRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(message_schema_1.Message.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ChatRepository);
//# sourceMappingURL=chat.repository.js.map