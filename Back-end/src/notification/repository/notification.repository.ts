import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from '../schema/notification.schema';

@Injectable()
export class NotificationRepository {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<Notification>,
  ) {}

  async create(notificationData: Partial<Notification>) {
    const notification = new this.notificationModel(notificationData);
    return await notification.save();
  }

  async findAllForAdmin() {
    return await this.notificationModel
      .find({ recipient: 'admin' })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findUnreadForAdmin() {
    return await this.notificationModel
      .find({ recipient: 'admin', isRead: false })
      .sort({ createdAt: -1 })
      .exec();
  }

  async markAsRead(notificationId: string) {
    return await this.notificationModel.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true },
    );
  }

  async markAllAsRead() {
    return await this.notificationModel.updateMany(
      { recipient: 'admin', isRead: false },
      { isRead: true },
    );
  }

  async getUnreadCount() {
    return await this.notificationModel.countDocuments({
      recipient: 'admin',
      isRead: false,
    });
  }
}

