<<<<<<< HEAD
import { IsNotEmpty, IsNumber, IsString, IsArray, IsOptional } from 'class-validator';
=======
import { IsNotEmpty, IsNumber, IsString, IsArray, IsOptional, Min, IsInt } from 'class-validator';
>>>>>>> origin/back-up

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  descriptionFull: string;

  @IsNotEmpty()
  @IsNumber()
  originalPrice: number;

  @IsNotEmpty()
  @IsNumber()
  salePrice: number;

  @IsNotEmpty()
  @IsString()
  material: string;

  @IsOptional()
  @IsNumber()
  weight?: number;

  @IsOptional()
  @IsString()
  size?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsString()
  style?: string;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  origin?: string;

  @IsOptional()
  @IsString()
  warranty?: string;

  @IsNotEmpty()
  @IsString()
  typeId: string; // Loại sản phẩm: ring, necklace, bracelet, earring, anklet

  @IsNotEmpty()
<<<<<<< HEAD
  @IsArray()
  @IsString({ each: true })
  images: string[];
=======
  @IsString()
  categoryId: string;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  images: string[];

  @IsOptional()
  @IsInt({ message: 'Số lượng nhập vào phải là số nguyên' })
  @Min(1, { message: 'Số lượng nhập vào phải lớn hơn 0' })
  quantity?: number;

  @IsOptional()
  @IsNumber()
  importPrice?: number;
>>>>>>> origin/back-up
}
