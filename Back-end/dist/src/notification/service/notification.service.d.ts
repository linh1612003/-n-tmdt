import { NotificationRepository } from '../repository/notification.repository';
export declare class NotificationService {
    private readonly notificationRepository;
    constructor(notificationRepository: NotificationRepository);
    createNewOrderNotification(orderId: string, orderInfo: any): Promise<import("mongoose").Document<unknown, {}, import("../schema/notification.schema").Notification> & import("../schema/notification.schema").Notification & Required<{
        _id: unknown;
    }>>;
    getAllNotifications(): Promise<(import("mongoose").Document<unknown, {}, import("../schema/notification.schema").Notification> & import("../schema/notification.schema").Notification & Required<{
        _id: unknown;
    }>)[]>;
    getUnreadNotifications(): Promise<(import("mongoose").Document<unknown, {}, import("../schema/notification.schema").Notification> & import("../schema/notification.schema").Notification & Required<{
        _id: unknown;
    }>)[]>;
    markAsRead(notificationId: string): Promise<import("mongoose").Document<unknown, {}, import("../schema/notification.schema").Notification> & import("../schema/notification.schema").Notification & Required<{
        _id: unknown;
    }>>;
    markAllAsRead(): Promise<import("mongoose").UpdateWriteOpResult>;
    getUnreadCount(): Promise<number>;
}
