import { Optional } from '@nestjs/common';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ProductOrder } from 'src/interface/product-order.interface';
import { ShippingInfoDto } from './ShippingInfo.dto';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  products: ProductOrder[];

  @IsOptional()
  @ValidateNested()
  @Type(() => ShippingInfoDto)
  shippingInfo?: ShippingInfoDto;

  @IsOptional()
  @IsBoolean()
  isInCart?: Boolean;
}
