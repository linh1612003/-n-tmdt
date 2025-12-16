import { ChatRepository } from '../repository/chat.repository';
import { CreateMessageDto } from '../dto/create-message.dto';
import { Types } from 'mongoose';
import { Model } from 'mongoose';
import { User } from '../../auth/schemas/user.schema';
export declare class ChatService {
    private readonly chatRepository;
    private readonly userModel;
    constructor(chatRepository: ChatRepository, userModel: Model<User>);
    createMessage(createMessageDto: CreateMessageDto, senderId: string, senderRole: string): Promise<import("../schema/message.schema").Message[]>;
    getMessages(userId: string, otherUserId: string): Promise<import("../schema/message.schema").Message[]>;
    markAsRead(senderId: string, receiverId: string): Promise<void>;
    getUnreadCount(userId: string): Promise<number>;
    getConversations(userId: string, userRole: string): Promise<any[]>;
    getAdminUser(): Promise<{
        _id: Types.ObjectId;
        displayName: string;
        avaUrl: string;
        role: string;
    }>;
    getUserById(userId: string): Promise<import("mongoose").Document<unknown, {}, User> & User & {
        _id: Types.ObjectId;
    }>;
}
