import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  Param,
  UnauthorizedException,
} from '@nestjs/common';
import { ChatService } from './services/chat.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
  ) {}

  @Post('message')
  async createMessage(@Body() createMessageDto: CreateMessageDto, @Request() req) {
    if (!req.user || !req.user.userId) {
      throw new UnauthorizedException('User not authenticated');
    }
    const senderId = req.user.userId;
    const senderRole = req.user.role || 'user';
    return this.chatService.createMessage(
      createMessageDto,
      senderId,
      senderRole,
    );
  }

  @Get('messages/:otherUserId')
  async getMessages(@Param('otherUserId') otherUserId: string, @Request() req) {
    if (!req.user || !req.user.userId) {
      throw new UnauthorizedException('User not authenticated');
    }
    const userId = req.user.userId;
    return this.chatService.getMessages(userId, otherUserId);
  }

  @Get('conversations')
  async getConversations(@Request() req) {
    if (!req.user || !req.user.userId) {
      throw new UnauthorizedException('User not authenticated');
    }
    const userId = req.user.userId;
    // Lấy role từ database vì token có thể không có role
    const user = await this.chatService.getUserById(userId);
    const userRole = user?.role || 'user';
    console.log('ChatController: getConversations', { userId, userRole, userRoleFromToken: req.user.role });
    return this.chatService.getConversations(userId, userRole);
  }

  @Get('unread-count')
  async getUnreadCount(@Request() req) {
    if (!req.user || !req.user.userId) {
      throw new UnauthorizedException('User not authenticated');
    }
    const userId = req.user.userId;
    const count = await this.chatService.getUnreadCount(userId);
    return { count };
  }

  @Post('mark-read/:senderId')
  async markAsRead(@Param('senderId') senderId: string, @Request() req) {
    if (!req.user || !req.user.userId) {
      throw new UnauthorizedException('User not authenticated');
    }
    const receiverId = req.user.userId;
    await this.chatService.markAsRead(senderId, receiverId);
    return { message: 'Messages marked as read' };
  }

  @Get('admin')
  async getAdmin(@Request() req) {
    // Endpoint này không cần req.user, nhưng vẫn cần authentication
    // Nếu có middleware thì req.user sẽ có, nếu không thì cũng không sao
    return this.chatService.getAdminUser();
  }
}
