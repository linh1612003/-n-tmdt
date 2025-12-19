import { Model } from 'mongoose';
import { Notification } from '../schema/notification.schema';
export declare class NotificationRepository {
    private notificationModel;
    constructor(notificationModel: Model<Notification>);
    create(notificationData: Partial<Notification>): Promise<import("mongoose").Document<unknown, {}, Notification> & Notification & Required<{
        _id: unknown;
    }>>;
    findAllForAdmin(): Promise<(import("mongoose").Document<unknown, {}, Notification> & Notification & Required<{
        _id: unknown;
    }>)[]>;
    findUnreadForAdmin(): Promise<(import("mongoose").Document<unknown, {}, Notification> & Notification & Required<{
        _id: unknown;
    }>)[]>;
    markAsRead(notificationId: string): Promise<import("mongoose").Document<unknown, {}, Notification> & Notification & Required<{
        _id: unknown;
    }>>;
    markAllAsRead(): Promise<import("mongoose").UpdateWriteOpResult>;
    getUnreadCount(): Promise<number>;
}
