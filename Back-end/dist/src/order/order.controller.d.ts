import { OrderService } from './service/order.service';
import { CreateOrderDto } from './dto/CreateOrder.dto';
import { Request } from 'express';
export declare class OrderController {
    private readonly orderService;
    constructor(orderService: OrderService);
    getAllOrders(): Promise<(import("mongoose").Document<unknown, {}, import("./schema/order.shema").Order> & import("./schema/order.shema").Order & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    getTotalRevenue(): Promise<{
        totalRevenue: any;
    }>;
    getOrderUser(userId: string, req: Request): Promise<(import("mongoose").Document<unknown, {}, import("./schema/order.shema").Order> & import("./schema/order.shema").Order & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    getOrderById(orderId: string): Promise<import("mongoose").Document<unknown, {}, import("./schema/order.shema").Order> & import("./schema/order.shema").Order & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    CreateOrder(createOrderDto: CreateOrderDto): Promise<{
        mesage: string;
        orderExist: import("mongoose").Document<unknown, {}, import("./schema/order.shema").Order> & import("./schema/order.shema").Order & {
            _id: import("mongoose").Types.ObjectId;
        };
    }>;
    updateStatus(orderId: string, paymentMethod: string): Promise<{
        message: boolean;
        paymentUrl: {
            success: boolean;
            paymentInf: any;
            message?: undefined;
        } | {
            success: boolean;
            message: any;
            paymentInf?: undefined;
        };
        mesage?: undefined;
    } | {
        paymentUrl: any;
        message?: undefined;
        mesage?: undefined;
    } | {
        message: string;
        paymentUrl?: undefined;
        mesage?: undefined;
    } | {
        mesage: string;
        message?: undefined;
        paymentUrl?: undefined;
    }>;
    updateShippingInfo(orderId: string, data: any): Promise<{
        mesage: string;
    }>;
    updateShippingStatus(orderId: string, shippingStatus: string): Promise<{
        mesage: string;
    }>;
}
