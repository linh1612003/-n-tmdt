import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Otp } from '../schemas/otp.schema';

@Injectable()
export class OtpRepository {
  constructor(
    @InjectModel(Otp.name)
    private OtpModel: Model<Otp>,
  ) {}

  async createOtp(email: string, otp: string, expiresAt: Date, type: string = 'register') {
    // Xóa OTP cũ nếu có (cùng loại)
    await this.OtpModel.deleteMany({ email, isUsed: false, type });
    
    return await this.OtpModel.create({
      email,
      otp,
      expiresAt,
      isUsed: false,
      type,
    });
  }

  async findValidOtp(email: string, otp: string, type: string = 'register') {
    return await this.OtpModel.findOne({
      email,
      otp,
      isUsed: false,
      expiresAt: { $gt: new Date() },
      type,
    });
  }

  async markOtpAsUsed(email: string, otp: string) {
    return await this.OtpModel.findOneAndUpdate(
      { email, otp },
      { isUsed: true },
      { new: true },
    );
  }
}

