import { Controller, Get, Put, Param } from '@nestjs/common';
import { NotificationService } from './service/notification.service';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  async getAllNotifications() {
    return await this.notificationService.getAllNotifications();
  }

  @Get('unread')
  async getUnreadNotifications() {
    return await this.notificationService.getUnreadNotifications();
  }

  @Get('unread-count')
  async getUnreadCount() {
    const count = await this.notificationService.getUnreadCount();
    return { count };
  }

  @Put(':id/read')
  async markAsRead(@Param('id') id: string) {
    return await this.notificationService.markAsRead(id);
  }

  @Put('mark-all-read')
  async markAllAsRead() {
    return await this.notificationService.markAllAsRead();
  }
}

