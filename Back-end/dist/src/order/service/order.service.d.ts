import { Types } from 'mongoose';
import { OrderRepository } from '../repository/order.repository';
import { ObjectId } from 'mongodb';
import { CreateOrderDto } from '../dto/CreateOrder.dto';
import { CartService } from './../../cart/service/cart.service';
import { PaymentService } from './../../payment/payment.service';
import { NotificationService } from './../../notification/service/notification.service';
import { ProductRepository } from 'src/product/repository/product.repository';
export declare class OrderService {
    private readonly paymentService;
    private orderRepository;
    private cartService;
    private notificationService;
    private productRepository;
    constructor(paymentService: PaymentService, orderRepository: OrderRepository, cartService: CartService, notificationService: NotificationService, productRepository: ProductRepository);
    getAllOrders(): Promise<(import("mongoose").Document<unknown, {}, import("../schema/order.shema").Order> & import("../schema/order.shema").Order & {
        _id: Types.ObjectId;
    })[]>;
    getOrderUser(userId: any): Promise<(import("mongoose").Document<unknown, {}, import("../schema/order.shema").Order> & import("../schema/order.shema").Order & {
        _id: Types.ObjectId;
    })[]>;
    createOrder(createOrderDto: CreateOrderDto): Promise<{
        mesage: string;
        orderExist: import("mongoose").Document<unknown, {}, import("../schema/order.shema").Order> & import("../schema/order.shema").Order & {
            _id: Types.ObjectId;
        };
    }>;
    getOrderById(orderId: string): Promise<import("mongoose").Document<unknown, {}, import("../schema/order.shema").Order> & import("../schema/order.shema").Order & {
        _id: Types.ObjectId;
    }>;
    getUrlPaymentOrder(orderId: string): Promise<{
        success: boolean;
        paymentInf: any;
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        paymentInf?: undefined;
    }>;
    updateShippingInfo(orderId: string, data: any): Promise<{
        mesage: string;
    }>;
    updatePaymentStatus(orderId: string, paymentMethod: string): Promise<{
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
    updateStatus(orderId: string): Promise<{
        mesage: string;
    }>;
    updateShippingStatus(orderId: string, shippingStatus: string): Promise<{
        mesage: string;
    }>;
    hasUserBoughtProduct(userId: ObjectId, productId: string): Promise<(import("mongoose").Document<unknown, {}, import("../schema/order.shema").Order> & import("../schema/order.shema").Order & {
        _id: Types.ObjectId;
    })[]>;
    updatePaymentStatusVNPay(orderId: string, paymentStatus: string): Promise<{
        message: string;
    }>;
    setVNPayRef(orderId: string, txnRef: string): Promise<import("mongoose").Document<unknown, {}, import("../schema/order.shema").Order> & import("../schema/order.shema").Order & {
        _id: Types.ObjectId;
    }>;
    findOrderIdByVNPayRef(txnRef: string): Promise<Types.ObjectId>;
    getTotalRevenue(): Promise<any>;
    getTotalCost(): Promise<number>;
    getRevenueAndProfit(): Promise<{
        totalRevenue: number;
        totalCost: number;
        profit: number;
    }>;
}
