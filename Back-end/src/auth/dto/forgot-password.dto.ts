import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class ForgotPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;
}

