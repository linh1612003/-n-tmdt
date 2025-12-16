import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Otp {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  otp: string;

  @Prop({ required: true })
  expiresAt: Date;

  @Prop({ default: false })
  isUsed: boolean;

  @Prop({ default: 'register' }) // 'register' hoặc 'reset-password'
  type: string;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);

