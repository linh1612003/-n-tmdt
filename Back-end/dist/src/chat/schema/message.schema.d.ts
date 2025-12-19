import { Types } from 'mongoose';
export interface QuickReply {
    title: string;
    payload: string;
}
export declare class Message {
    _id?: Types.ObjectId;
    senderId: Types.ObjectId;
    receiverId: Types.ObjectId;
    content: string;
    isRead: boolean;
    senderRole: string;
    quickReplies?: QuickReply[];
    metadata?: {
        intent?: string;
        orderId?: string;
        productId?: string;
        handoffRequested?: boolean;
        productUrl?: string;
        productLinks?: Array<{
            productId: string;
            url: string;
            name: string;
            price?: number;
            image?: string;
        }>;
    };
}
export declare const MessageSchema: import("mongoose").Schema<Message, import("mongoose").Model<Message, any, any, any, import("mongoose").Document<unknown, any, Message> & Message & Required<{
    _id: Types.ObjectId;
}>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Message, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Message>> & import("mongoose").FlatRecord<Message> & Required<{
    _id: Types.ObjectId;
}>>;
