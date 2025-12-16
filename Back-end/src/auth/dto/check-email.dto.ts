import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class CheckEmailDto {
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;
}

