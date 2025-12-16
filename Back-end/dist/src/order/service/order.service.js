"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const order_repository_1 = require("../repository/order.repository");
const cart_service_1 = require("./../../cart/service/cart.service");
const payment_service_1 = require("./../../payment/payment.service");
let OrderService = class OrderService {
    constructor(paymentService, orderRepository, cartService) {
        this.paymentService = paymentService;
        this.orderRepository = orderRepository;
        this.cartService = cartService;
    }
    async getAllOrders() {
        return await this.orderRepository.getAll();
    }
    async getOrderUser(userId) {
        console.log('getOrderUser - userId received:', userId, 'type:', typeof userId);
        if (!userId) {
            throw new common_1.HttpException('UserId is required', common_1.HttpStatus.BAD_REQUEST);
        }
        const normalizedUserId = String(userId).trim();
        if (!/^[0-9a-fA-F]{24}$/.test(normalizedUserId)) {
            console.error('getOrderUser - Invalid userId format:', normalizedUserId);
            throw new common_1.HttpException('Invalid userId format', common_1.HttpStatus.BAD_REQUEST);
        }
        let userIdObjectId;
        try {
            userIdObjectId = new mongoose_1.Types.ObjectId(normalizedUserId);
        }
        catch (error) {
            console.error('getOrderUser - Error creating ObjectId:', error);
            throw new common_1.HttpException('Invalid userId format', common_1.HttpStatus.BAD_REQUEST);
        }
        console.log('getOrderUser - converted ObjectId:', userIdObjectId.toString());
        console.log('getOrderUser - requesting orders for userId:', normalizedUserId);
        const orderUser = await this.orderRepository.findOrderUser(userIdObjectId);
        console.log('getOrderUser - orders found from repository:', orderUser?.length || 0);
        const targetUserIdStr = normalizedUserId.toLowerCase().trim();
        const finalFilteredOrders = (orderUser || []).filter(order => {
            if (!order || !order.userId) {
                console.warn('getOrderUser - Order missing userId:', order?._id?.toString());
                return false;
            }
            const orderUserIdStr = String(order.userId).trim().toLowerCase();
            const matches = orderUserIdStr === targetUserIdStr;
            if (!matches) {
                console.error('getOrderUser - SECURITY WARNING: Order userId mismatch!', {
                    orderId: order._id?.toString(),
                    orderUserId: String(order.userId),
                    targetUserId: normalizedUserId,
                    orderUserIdNormalized: orderUserIdStr,
                    targetUserIdNormalized: targetUserIdStr
                });
            }
            return matches;
        });
        console.log('getOrderUser - final filtered orders:', finalFilteredOrders.length);
        if (orderUser.length !== finalFilteredOrders.length) {
            console.error('getOrderUser - WARNING: Some orders were filtered out in service!', {
                original: orderUser.length,
                filtered: finalFilteredOrders.length,
                filteredOut: orderUser.length - finalFilteredOrders.length
            });
        }
        if (finalFilteredOrders.length > 0) {
            console.log('getOrderUser - Sample final orders userIds:');
            finalFilteredOrders.slice(0, 3).forEach((order, index) => {
                console.log(`  Final Order ${index + 1} userId:`, String(order.userId));
            });
        }
        return finalFilteredOrders;
    }
    async createOrder(createOrderDto) {
        let totalAmount = 0;
        let productIds = [];
        createOrderDto.products.forEach((product) => {
            totalAmount += product.quantity * product.price;
            productIds.push(product.productId);
        });
        const userIdObject = new mongoose_1.Types.ObjectId(createOrderDto.userId);
        const newOrder = { ...createOrderDto, userId: userIdObject, totalAmount };
        try {
            if (createOrderDto.isInCart) {
                await this.cartService.deleteCartByProductIdsAndUserId(createOrderDto.userId, productIds);
            }
            const orderExist = await this.orderRepository.create(newOrder);
            return {
                mesage: 'create order successfully',
                orderExist,
            };
        }
        catch (err) {
            console.error('Create order error:', err);
            const errorMessage = err.message || 'Create order error';
            throw new common_1.HttpException(errorMessage, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getOrderById(orderId) {
        return this.orderRepository.findById(orderId);
    }
    async getUrlPaymentOrder(orderId) {
        try {
            const orderExist = await this.orderRepository.findById(orderId);
            if (!orderExist) {
                throw new Error('Order not found');
            }
            const paymentInf = await this.paymentService.createZaloPayment(orderExist.totalAmount, orderId);
            if (paymentInf) {
                return { success: true, paymentInf };
            }
            else {
                throw new Error('Failed to create payment URL');
            }
        }
        catch (error) {
            return { success: false, message: error.message };
        }
    }
    async updateShippingInfo(orderId, data) {
        const orderExist = await this.orderRepository.findById(orderId);
        if (!orderExist) {
            throw new common_1.HttpException('Order not found', common_1.HttpStatus.NOT_FOUND);
        }
        try {
            await this.orderRepository.updateShippingInfo(orderId, data.shippingInfo);
        }
        catch (error) {
            console.log(error);
        }
        return {
            mesage: 'update Shipping information successfully',
        };
    }
    async updatePaymentStatus(orderId, paymentMethod) {
        if (paymentMethod === 'payment') {
            const paymentUrl = await this.getUrlPaymentOrder(orderId);
            return {
                message: paymentUrl.success,
                paymentUrl,
            };
        }
        if (paymentMethod === 'vnpay') {
            const orderExist = await this.orderRepository.findById(orderId);
            if (!orderExist) {
                throw new common_1.HttpException('Order not found', common_1.HttpStatus.NOT_FOUND);
            }
            const result = await this.paymentService.createVNPayPayment(orderExist.totalAmount, orderId);
            return {
                paymentUrl: result.paymentUrl,
            };
        }
        if (paymentMethod === 'zalopay') {
            const orderExist = await this.orderRepository.findById(orderId);
            if (!orderExist) {
                throw new common_1.HttpException('Order not found', common_1.HttpStatus.NOT_FOUND);
            }
            const paymentInf = await this.paymentService.createZaloPayment(orderExist.totalAmount, orderId);
            return {
                paymentUrl: paymentInf,
            };
        }
        if (paymentMethod === 'vnpay_callback') {
            await this.orderRepository.updatePaymentStatus(orderId, 'Đã thanh toán');
            return { message: 'Update status to Đã thanh toán for VNPay' };
        }
        if (paymentMethod === 'cash') {
            await this.orderRepository.updatePaymentStatus(orderId, 'Thanh toán khi nhận hàng');
            return { message: 'Update status to Thanh toán khi nhận hàng for COD' };
        }
        return {
            mesage: 'Update status to pending',
        };
    }
    async updateStatus(orderId) {
        const orderExist = await this.orderRepository.findById(orderId);
        if (!orderExist) {
            throw new common_1.HttpException('Order not found', common_1.HttpStatus.NOT_FOUND);
        }
        try {
            await this.orderRepository.updateStatus(orderId);
            return {
                mesage: 'Update status success',
            };
        }
        catch (err) {
            throw new common_1.HttpException('Update status error', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateShippingStatus(orderId, shippingStatus) {
        const orderExist = await this.orderRepository.findById(orderId);
        if (!orderExist) {
            throw new common_1.HttpException('Order not found', common_1.HttpStatus.NOT_FOUND);
        }
        try {
            await this.orderRepository.updateShippingStatus(orderId, shippingStatus);
            if (shippingStatus == 'đã giao hàng') {
                await this.updateStatus(orderId);
            }
            return {
                mesage: 'Update shipping status success',
            };
        }
        catch (err) {
            throw new common_1.HttpException('Update shipping status error', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async hasUserBoughtProduct(userId, productId) {
        const data = { userId, productId, status: 'success' };
        const orderExist = await this.orderRepository.findOrderSuccess(data);
        return orderExist;
    }
    async updatePaymentStatusVNPay(orderId, paymentStatus) {
        const orderExist = await this.orderRepository.findById(orderId);
        if (!orderExist) {
            throw new common_1.HttpException('Order not found', common_1.HttpStatus.NOT_FOUND);
        }
        await this.orderRepository.updatePaymentStatus(orderId, paymentStatus);
        return {
            message: 'Update VNPay payment status success',
        };
    }
    async setVNPayRef(orderId, txnRef) {
        return this.orderRepository.setVNPayRef(orderId, txnRef);
    }
    async findOrderIdByVNPayRef(txnRef) {
        return this.orderRepository.findOrderIdByVNPayRef(txnRef);
    }
    async getTotalRevenue() {
        return await this.orderRepository.getTotalRevenue();
    }
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => payment_service_1.PaymentService))),
    __metadata("design:paramtypes", [payment_service_1.PaymentService,
        order_repository_1.OrderRepository,
        cart_service_1.CartService])
], OrderService);
//# sourceMappingURL=order.service.js.map