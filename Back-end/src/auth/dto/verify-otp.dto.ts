import { IsNotEmpty, IsString, IsEmail, Length, MinLength, MaxLength } from 'class-validator';

export class VerifyOtpDto {
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 6, { message: 'OTP must be exactly 6 digits' })
  otp: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(30)
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(16)
  displayName: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

