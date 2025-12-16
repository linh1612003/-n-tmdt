import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

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
  senderRole: string; // 'user' or 'admin'
}

export const MessageSchema = SchemaFactory.createForClass(Message);

