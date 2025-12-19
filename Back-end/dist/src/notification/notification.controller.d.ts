import { NotificationService } from './service/notification.service';
export declare class NotificationController {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    getAllNotifications(): Promise<(import("mongoose").Document<unknown, {}, import("./schema/notification.schema").Notification> & import("./schema/notification.schema").Notification & Required<{
        _id: unknown;
    }>)[]>;
    getUnreadNotifications(): Promise<(import("mongoose").Document<unknown, {}, import("./schema/notification.schema").Notification> & import("./schema/notification.schema").Notification & Required<{
        _id: unknown;
    }>)[]>;
    getUnreadCount(): Promise<{
        count: number;
    }>;
    markAsRead(id: string): Promise<import("mongoose").Document<unknown, {}, import("./schema/notification.schema").Notification> & import("./schema/notification.schema").Notification & Required<{
        _id: unknown;
    }>>;
    markAllAsRead(): Promise<import("mongoose").UpdateWriteOpResult>;
}
