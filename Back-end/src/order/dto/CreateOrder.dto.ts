import { IsBoolean, IsNotEmpty, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ProductOrder } from 'src/interface/product-order.interface';
import { ShippingInfo } from 'src/interface/shipping-infor.interface';

class ShippingInfoDto {
  @IsNotEmpty()
  @IsString()
  receiver: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  addressDetail: string;
}

export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  products: ProductOrder[];

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => ShippingInfoDto)
  shippingInfo?: ShippingInfoDto;

  @IsOptional()
  @IsBoolean()
  isInCart?: Boolean;
}
