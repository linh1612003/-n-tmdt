<<<<<<< HEAD
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type, Transform } from 'class-transformer';
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

class ProductOrderDto {
  @IsNotEmpty()
  @IsString()
  productId: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @Transform(({ value }) => parseFloat(value))
  price: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @Transform(({ value }) => parseInt(value, 10))
  quantity: number;

  @IsNotEmpty()
  @IsString()
  urlImage: string;
}
=======
import { Optional } from '@nestjs/common';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ProductOrder } from 'src/interface/product-order.interface';
import { ShippingInfoDto } from './ShippingInfo.dto';
>>>>>>> origin/back-up

export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
<<<<<<< HEAD
  @IsArray()
  @ArrayMinSize(1, { message: 'Phải có ít nhất 1 sản phẩm trong đơn hàng' })
  @ValidateNested({ each: true })
  @Type(() => ProductOrderDto)
  products: ProductOrderDto[];

  @IsOptional()
  @IsObject()
=======
  products: ProductOrder[];

  @IsOptional()
>>>>>>> origin/back-up
  @ValidateNested()
  @Type(() => ShippingInfoDto)
  shippingInfo?: ShippingInfoDto;

  @IsOptional()
  @IsBoolean()
  isInCart?: Boolean;
}
