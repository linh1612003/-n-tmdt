<<<<<<< HEAD
import { IsNotEmpty, IsString, isString } from 'class-validator';
=======
import { IsNotEmpty, IsString } from 'class-validator';
>>>>>>> origin/back-up

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  name: string;
<<<<<<< HEAD

  @IsNotEmpty()
  @IsString()
  availabilityStatus: string;

  @IsNotEmpty()
  @IsString()
  order: number;

  @IsNotEmpty()
  @IsString()
  menuId: string;
=======
>>>>>>> origin/back-up
}
