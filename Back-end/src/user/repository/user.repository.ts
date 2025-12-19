import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/auth/schemas/user.schema';
import { ObjectId } from 'mongodb';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name)
    private UserModel: Model<User>,
  ) { }

  async findById(userId: string) {
    return await this.UserModel.findById(userId);
  }

  async updateShippingInfo(userId: string, data: any) {
    console.log('updateShippingInfo - userId:', userId);
    console.log('updateShippingInfo - data:', data);
    const updateData: any = {};

    // Luôn cập nhật các trường này nếu có trong data (kể cả chuỗi rỗng)
    if (data.contactPhone !== undefined && data.contactPhone !== null) {
      updateData.contactPhone = data.contactPhone;
    }
    if (data.address !== undefined && data.address !== null) {
      updateData.address = data.address;
    }
    if (data.addressDetail !== undefined && data.addressDetail !== null) {
      updateData.addressDetail = data.addressDetail;
    }

    console.log('updateShippingInfo - updateData:', updateData);

    if (Object.keys(updateData).length === 0) {
      console.log('updateShippingInfo - No data to update');
      return await this.UserModel.findById(userId);
    }

    const result = await this.UserModel.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true },
    );

    console.log('updateShippingInfo - result after update:', result);
    console.log('updateShippingInfo - result.address:', result?.address);
    console.log('updateShippingInfo - result.addressDetail:', result?.addressDetail);

    return result;
  }

  async findUserToUpdate(userId: string): Promise<User> {
    const user = await this.UserModel.findById(userId)
      .select('displayName contactPhone facebookId avaUrl')
      .lean();

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
  async saveUserByUserId(userId: string, updateData: any): Promise<User> {
    console.log('updateData :', updateData);
    console.log('userId :', userId);

    const userIdObject = new ObjectId(userId);
    const updatedUser = await this.UserModel.findOneAndUpdate(
      { _id: userIdObject },
      { $set: updateData },
      { new: true, runValidators: true },
    ).select('displayName contactPhone facebookId avaUrl');
    return updatedUser;
  }
}
