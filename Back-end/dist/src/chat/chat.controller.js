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
exports.ChatController = void 0;
const common_1 = require("@nestjs/common");
const chat_service_1 = require("./services/chat.service");
const create_message_dto_1 = require("./dto/create-message.dto");
let ChatController = class ChatController {
    constructor(chatService) {
        this.chatService = chatService;
    }
    async createMessage(createMessageDto, req) {
        if (!req.user || !req.user.userId) {
            throw new common_1.UnauthorizedException('User not authenticated');
        }
        const senderId = req.user.userId;
        const senderRole = req.user.role || 'user';
        return this.chatService.createMessage(createMessageDto, senderId, senderRole);
    }
    async getMessages(otherUserId, req) {
        if (!req.user || !req.user.userId) {
            throw new common_1.UnauthorizedException('User not authenticated');
        }
        const userId = req.user.userId;
        return this.chatService.getMessages(userId, otherUserId);
    }
    async getConversations(req) {
        if (!req.user || !req.user.userId) {
            throw new common_1.UnauthorizedException('User not authenticated');
        }
        const userId = req.user.userId;
        const user = await this.chatService.getUserById(userId);
        const userRole = user?.role || 'user';
        console.log('ChatController: getConversations', { userId, userRole, userRoleFromToken: req.user.role });
        return this.chatService.getConversations(userId, userRole);
    }
    async getUnreadCount(req) {
        if (!req.user || !req.user.userId) {
            throw new common_1.UnauthorizedException('User not authenticated');
        }
        const userId = req.user.userId;
        const count = await this.chatService.getUnreadCount(userId);
        return { count };
    }
    async markAsRead(senderId, req) {
        if (!req.user || !req.user.userId) {
            throw new common_1.UnauthorizedException('User not authenticated');
        }
        const receiverId = req.user.userId;
        await this.chatService.markAsRead(senderId, receiverId);
        return { message: 'Messages marked as read' };
    }
    async getAdmin(req) {
        return this.chatService.getAdminUser();
    }
};
exports.ChatController = ChatController;
__decorate([
    (0, common_1.Post)('message'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_message_dto_1.CreateMessageDto, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "createMessage", null);
__decorate([
    (0, common_1.Get)('messages/:otherUserId'),
    __param(0, (0, common_1.Param)('otherUserId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getMessages", null);
__decorate([
    (0, common_1.Get)('conversations'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getConversations", null);
__decorate([
    (0, common_1.Get)('unread-count'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getUnreadCount", null);
__decorate([
    (0, common_1.Post)('mark-read/:senderId'),
    __param(0, (0, common_1.Param)('senderId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "markAsRead", null);
__decorate([
    (0, common_1.Get)('admin'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getAdmin", null);
exports.ChatController = ChatController = __decorate([
    (0, common_1.Controller)('chat'),
    __metadata("design:paramtypes", [chat_service_1.ChatService])
], ChatController);
//# sourceMappingURL=chat.controller.js.map