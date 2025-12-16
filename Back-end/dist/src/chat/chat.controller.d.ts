import { ChatService } from './services/chat.service';
import { CreateMessageDto } from './dto/create-message.dto';
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    createMessage(createMessageDto: CreateMessageDto, req: any): Promise<import("./schema/message.schema").Message[]>;
    getMessages(otherUserId: string, req: any): Promise<import("./schema/message.schema").Message[]>;
    getConversations(req: any): Promise<any[]>;
    getUnreadCount(req: any): Promise<{
        count: number;
    }>;
    markAsRead(senderId: string, req: any): Promise<{
        message: string;
    }>;
    getAdmin(req: any): Promise<{
        _id: import("mongoose").Types.ObjectId;
        displayName: string;
        avaUrl: string;
        role: string;
    }>;
}
