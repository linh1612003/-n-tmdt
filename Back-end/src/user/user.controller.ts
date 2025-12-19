import { Body, Controller, Param, Put } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UpdateUserDto } from './dto/update-user.Dto';
<<<<<<< HEAD
import { UserRepository } from './repository/user.repository';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userRepository: UserRepository,
  ) { }

  // Route cụ thể hơn phải được đăng ký trước route có parameter
  @Put(':userId/shipping-infor')
  async updateShippingInfo(@Param('userId') userId: string, @Body() data: any) {
    console.log('=== UserController - updateShippingInfo ===');
    console.log('userId:', userId);
    console.log('received data:', JSON.stringify(data, null, 2));
    try {
      const result = await this.userService.updateShippingInfo(userId, data);
      console.log('UserController - updateShippingInfo - result:', result);

      // Verify data was saved by fetching user again
      const updatedUser = await this.userRepository.findById(userId);
      console.log('UserController - Verified saved data:');
      console.log('  - address:', updatedUser?.address);
      console.log('  - addressDetail:', updatedUser?.addressDetail);
      console.log('  - contactPhone:', updatedUser?.contactPhone);

      console.log('=== End UserController - updateShippingInfo ===');
      return result;
    } catch (error) {
      console.error('UserController - updateShippingInfo - error:', error);
      throw error;
    }
  }
=======

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
>>>>>>> origin/back-up

  @Put(':userId')
  async updateUser(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(userId, updateUserDto);
  }
<<<<<<< HEAD
=======

  @Put(':userId/shipping-infor')
  updateShippingInfo(@Param('userId') userId: string, @Body() data: any) {
    return this.userService.updateShippingInfo(userId, data);
  }
>>>>>>> origin/back-up
}
