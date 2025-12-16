import { Model } from 'mongoose';
import { Message } from '../schema/message.schema';
export declare class ChatRepository {
    private readonly messageModel;
    constructor(messageModel: Model<Message>);
    createMessage(messageData: Partial<Message>): Promise<Message>;
    getMessagesBetweenUsers(userId1: string, userId2: string): Promise<Message[]>;
    markMessagesAsRead(senderId: string, receiverId: string): Promise<void>;
    getUnreadCount(receiverId: string): Promise<number>;
    getAllConversationsForUser(userId: string, userRole: string): Promise<any[]>;
}
