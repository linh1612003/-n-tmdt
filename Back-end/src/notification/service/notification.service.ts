import { Injectable } from '@nestjs/common';
import { NotificationRepository } from '../repository/notification.repository';

@Injectable()
export class NotificationService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async createNewOrderNotification(orderId: string, orderInfo: any) {
    const notification = {
      type: 'new_order',
      title: 'Đơn hàng mới',
      message: `Có đơn hàng mới từ ${orderInfo.receiver || 'khách hàng'} - Tổng tiền: ${orderInfo.totalAmount?.toLocaleString('vi-VN')} VND`,
      orderId: orderId,
      isRead: false,
      recipient: 'admin',
    };

    return await this.notificationRepository.create(notification);
  }

  async getAllNotifications() {
    return await this.notificationRepository.findAllForAdmin();
  }

  async getUnreadNotifications() {
    return await this.notificationRepository.findUnreadForAdmin();
  }

  async markAsRead(notificationId: string) {
    return await this.notificationRepository.markAsRead(notificationId);
  }

  async markAllAsRead() {
    return await this.notificationRepository.markAllAsRead();
  }

  async getUnreadCount() {
    return await this.notificationRepository.getUnreadCount();
  }
}


