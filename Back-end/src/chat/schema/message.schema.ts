import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export interface QuickReply {
  title: string;
  payload: string;
}

@Schema({ timestamps: true })
export class Message {
  // MongoDB document id
  _id?: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  senderId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  receiverId: Types.ObjectId;

  @Prop({ required: true })
  content: string;

  @Prop({ default: false })
  isRead: boolean;

  @Prop({ default: 'user' })
  senderRole: string; // 'user' or 'admin' or 'chatbot'

  @Prop({ type: Array, default: [] })
  quickReplies?: QuickReply[];

  @Prop({ type: Object })
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

export const MessageSchema = SchemaFactory.createForClass(Message);

