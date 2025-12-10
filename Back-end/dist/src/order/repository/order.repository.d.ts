import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { Order } from '../schema/order.shema';
export declare class OrderRepository {
    private orderModel;
    constructor(orderModel: Model<Order>);
    getAll(): Promise<(import("mongoose").Document<unknown, {}, Order> & Order & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    findOrderUser(userId: ObjectId): Promise<(import("mongoose").Document<unknown, {}, Order> & Order & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    create(newOrder: any): Promise<import("mongoose").Document<unknown, {}, Order> & Order & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    findOrderSuccess(data: any): Promise<(import("mongoose").Document<unknown, {}, Order> & Order & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    findById(id: string): Promise<import("mongoose").Document<unknown, {}, Order> & Order & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    updateShippingInfo(orderId: string, shippingInfo: any): Promise<import("mongoose").Document<unknown, {}, Order> & Order & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    updatePaymentStatus(orderId: string, paymentStatus: string): Promise<import("mongoose").Document<unknown, {}, Order> & Order & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    updateStatus(orderId: string): Promise<import("mongoose").Document<unknown, {}, Order> & Order & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    updateShippingStatus(orderId: string, shippingStatus: string): Promise<import("mongoose").Document<unknown, {}, Order> & Order & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    setVNPayRef(orderId: string, txnRef: string): Promise<import("mongoose").Document<unknown, {}, Order> & Order & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    findOrderIdByVNPayRef(txnRef: string): Promise<import("mongoose").Types.ObjectId>;
    getTotalRevenue(): Promise<any>;
    getTotalCost(): Promise<number>;
    getRevenueAndProfit(): Promise<{
        totalRevenue: number;
        totalCost: number;
        profit: number;
    }>;
}
