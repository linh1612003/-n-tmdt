import { Model, Types } from 'mongoose';
import { Order } from '../schema/order.shema';
export declare class OrderRepository {
    private orderModel;
    constructor(orderModel: Model<Order>);
    getAll(): Promise<(import("mongoose").Document<unknown, {}, Order> & Order & {
        _id: Types.ObjectId;
    })[]>;
    findOrderUser(userId: Types.ObjectId): Promise<(import("mongoose").Document<unknown, {}, Order> & Order & {
        _id: Types.ObjectId;
    })[]>;
    create(newOrder: any): Promise<import("mongoose").Document<unknown, {}, Order> & Order & {
        _id: Types.ObjectId;
    }>;
    findOrderSuccess(data: any): Promise<(import("mongoose").Document<unknown, {}, Order> & Order & {
        _id: Types.ObjectId;
    })[]>;
    findById(id: string): Promise<import("mongoose").Document<unknown, {}, Order> & Order & {
        _id: Types.ObjectId;
    }>;
    updateShippingInfo(orderId: string, shippingInfo: any): Promise<import("mongoose").Document<unknown, {}, Order> & Order & {
        _id: Types.ObjectId;
    }>;
    updatePaymentStatus(orderId: string, paymentStatus: string): Promise<import("mongoose").Document<unknown, {}, Order> & Order & {
        _id: Types.ObjectId;
    }>;
    updateStatus(orderId: string): Promise<import("mongoose").Document<unknown, {}, Order> & Order & {
        _id: Types.ObjectId;
    }>;
    updateShippingStatus(orderId: string, shippingStatus: string): Promise<import("mongoose").Document<unknown, {}, Order> & Order & {
        _id: Types.ObjectId;
    }>;
    setVNPayRef(orderId: string, txnRef: string): Promise<import("mongoose").Document<unknown, {}, Order> & Order & {
        _id: Types.ObjectId;
    }>;
    findOrderIdByVNPayRef(txnRef: string): Promise<Types.ObjectId>;
    getTotalRevenue(): Promise<any>;
}
