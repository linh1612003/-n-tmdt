import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { UpdateUserDto } from '../dto/update-user.Dto';
import { UserRepository } from '../repository/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) { }

  async updateUser(userId: string, updateUserDto: UpdateUserDto) {
    const existingUser = await this.userRepository.findUserToUpdate(userId);
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }
    try {
      const userUpdate = await this.userRepository.saveUserByUserId(
        userId,
        updateUserDto,
      );
      return {
        message: 'Update user successfully',
        user: userUpdate,
      };
    } catch (err) {
      throw new HttpException('Update error', HttpStatus.BAD_REQUEST);
    }
  }

  async updateShippingInfo(userId: string, data: any) {
    console.log('UserService - updateShippingInfo - userId:', userId);
    console.log('UserService - updateShippingInfo - data:', JSON.stringify(data, null, 2));

    const existingUser = await this.userRepository.findById(userId);
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    console.log('UserService - existingUser before update:');
    console.log('  - address:', existingUser.address);
    console.log('  - addressDetail:', existingUser.addressDetail);
    console.log('  - contactPhone:', existingUser.contactPhone);

    try {
      const result = await this.userRepository.updateShippingInfo(userId, data);
      console.log('UserService - updateShippingInfo - result:', result);

      // Verify the update was successful
      const verifyUser = await this.userRepository.findById(userId);
      console.log('UserService - verifyUser after update:');
      console.log('  - address:', verifyUser?.address);
      console.log('  - addressDetail:', verifyUser?.addressDetail);
      console.log('  - contactPhone:', verifyUser?.contactPhone);

      return {
        message: 'Update shipping info successfully',
        user: {
          address: verifyUser?.address,
          addressDetail: verifyUser?.addressDetail,
          contactPhone: verifyUser?.contactPhone,
        },
      };
    } catch (err) {
      console.error('UserService - updateShippingInfo - error:', err);
      throw new HttpException(
        'Update shipping info error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
