import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Notification extends Document {
  @Prop({ required: true })
  type: string; // 'new_order', 'order_update', etc.

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  message: string;

  @Prop()
  orderId?: string;

  @Prop({ default: false })
  isRead: boolean;

  @Prop({ default: 'admin' })
  recipient: string; // 'admin' or specific userId
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);


