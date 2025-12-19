import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
require('dotenv').config();

@Injectable()
export class AuthRepository {
  constructor(
    @InjectModel(User.name)
    private UserModel: Model<User>,
  ) { }

  async findById(userId: string) {
    return await this.UserModel.findById(userId);
  }

  async findUserAndUpdateToken(
    username: string,
    accessToken: string,
    refreshToken: string,
  ) {
    await this.UserModel.findOneAndUpdate(
      { username: username },
      {
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
    );
  }

  async findUserByFacebookType(username: string) {
    return await this.UserModel.findOne({
      type: 'FACEBOOK',
      username: username,
    }).lean();
  }

  async findUserByGoogleType(username: string) {
    return await this.UserModel.findOne({
      type: 'GOOGLE',
      username: username,
    }).lean();
  }

  async createUserByFacebookType(username: string, displayName: string) {
    return await this.UserModel.create({
      type: 'FACEBOOK',
      username: username,
      displayName: displayName,
      facebookId: username,
    });
  }
  async createUserByGoogleType(
    username: string,
    displayName: string,
    avaUrl: string,
  ) {
    return await this.UserModel.create({
      type: 'GOOGLE',
      username: username,
      displayName: displayName,
      avaUrl: avaUrl,
    });
  }
  async createUser(user: any) {
    return await this.UserModel.create(user);
  }

  async findByUserName(username: string) {
    // Tìm kiếm case-insensitive để tránh lỗi do chữ hoa/thường
    // Escape các ký tự đặc biệt trong regex
    const escapedUsername = username.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return await this.UserModel.findOne({
      username: { $regex: new RegExp(`^${escapedUsername}$`, 'i') },
    }).lean();
  }

  async findAllUsersContainingEmail(email: string) {
    // Tìm tất cả users có username chứa email (để debug)
    const escapedEmail = email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return await this.UserModel.find({
      username: { $regex: new RegExp(escapedEmail, 'i') },
    }).lean();
  }

  async updateUser(username: string, updateData: any) {
    return await this.UserModel.findOneAndUpdate(
      { username: username },
      updateData,
      { new: true },
    );
  }
}
