import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  @IsString()
  receiverId: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(10000, { message: 'Tin nhắn không được vượt quá 10000 ký tự' })
  content: string;
}

