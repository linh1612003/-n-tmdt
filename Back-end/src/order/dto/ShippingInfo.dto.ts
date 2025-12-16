import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class ShippingInfoDto {
  @IsNotEmpty({ message: 'Vui lòng nhập tên người nhận' })
  @IsString()
  @MinLength(2, { message: 'Tên người nhận phải có ít nhất 2 ký tự' })
  receiver: string;

  @IsNotEmpty({ message: 'Vui lòng nhập số điện thoại' })
  @IsString()
  @Matches(/^(0|\+84|84)[0-9]{9,10}$/, {
    message: 'Số điện thoại không đúng định dạng. Vui lòng nhập số điện thoại Việt Nam (10 số bắt đầu bằng 0)',
  })
  phone: string;

  @IsNotEmpty({ message: 'Vui lòng nhập địa chỉ' })
  @IsString()
  address: string;

  @IsNotEmpty({ message: 'Vui lòng nhập chi tiết địa chỉ' })
  @IsString()
  addressDetail: string;
}


