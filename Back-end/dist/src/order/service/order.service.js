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
const mongodb_1 = require("mongodb");
const cart_service_1 = require("./../../cart/service/cart.service");
const payment_service_1 = require("./../../payment/payment.service");
const notification_service_1 = require("./../../notification/service/notification.service");
const product_repository_1 = require("../../product/repository/product.repository");
let OrderService = class OrderService {
    constructor(paymentService, orderRepository, cartService, notificationService, productRepository) {
        this.paymentService = paymentService;
        this.orderRepository = orderRepository;
        this.cartService = cartService;
        this.notificationService = notificationService;
        this.productRepository = productRepository;
    }
    async getAllOrders() {
        return await this.orderRepository.getAll();
    }
    async getOrderUser(userId) {
        const userIdObjectId = new mongodb_1.ObjectId(userId);
        const orderUser = await this.orderRepository.findOrderUser(userIdObjectId);
        return orderUser;
    }
    async createOrder(createOrderDto) {
        console.log('Creating order with data:', JSON.stringify(createOrderDto, null, 2));
        let totalAmount = 0;
        let productIds = [];
        const productsWithPrices = await Promise.all(createOrderDto.products.map(async (product) => {
            try {
                const productInfo = await this.productRepository.findById(product.productId.toString());
                if (!productInfo) {
                    console.error(`Product not found: ${product.productId}`);
                    throw new common_1.HttpException(`Sản phẩm với ID ${product.productId} không tồn tại`, common_1.HttpStatus.NOT_FOUND);
                }
                totalAmount += product.quantity * product.price;
                productIds.push(product.productId);
                return {
                    ...product,
                    importPrice: productInfo.importPrice || 0,
                };
            }
            catch (err) {
                console.error('Error processing product:', err);
                if (err instanceof common_1.HttpException) {
                    throw err;
                }
                throw new common_1.HttpException(`Lỗi khi xử lý sản phẩm ${product.productId}: ${err.message}`, common_1.HttpStatus.BAD_REQUEST);
            }
        }));
        const userIdObject = new mongoose_1.Types.ObjectId(createOrderDto.userId);
        const newOrder = {
            ...createOrderDto,
            products: productsWithPrices,
            userId: userIdObject,
            totalAmount
        };
        console.log('Order data to save:', JSON.stringify(newOrder, null, 2));
        try {
            if (createOrderDto.isInCart) {
                await this.cartService.deleteCartByProductIdsAndUserId(createOrderDto.userId, productIds);
            }
            const orderExist = await this.orderRepository.create(newOrder);
            try {
                await this.notificationService.createNewOrderNotification(orderExist._id.toString(), {
                    receiver: createOrderDto.shippingInfo?.receiver,
                    totalAmount: totalAmount,
                });
            }
            catch (error) {
                console.error('Error creating notification:', error);
            }
            console.log('Order created successfully:', orderExist._id);
            return {
                mesage: 'create order successfully',
                orderExist,
            };
        }
        catch (err) {
            console.error('Error creating order:', err);
            if (err instanceof common_1.HttpException) {
                throw err;
            }
            throw new common_1.HttpException(err.message || 'Create order error', common_1.HttpStatus.BAD_REQUEST);
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
    async getTotalCost() {
        return await this.orderRepository.getTotalCost();
    }
    async getRevenueAndProfit() {
        return await this.orderRepository.getRevenueAndProfit();
    }
    async getRevenueAndProfitByDateRange(startDate, endDate) {
        return await this.orderRepository.getRevenueAndProfitByDateRange(startDate, endDate);
    }
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => payment_service_1.PaymentService))),
    __metadata("design:paramtypes", [payment_service_1.PaymentService,
        order_repository_1.OrderRepository,
        cart_service_1.CartService,
        notification_service_1.NotificationService,
        product_repository_1.ProductRepository])
], OrderService);
//# sourceMappingURL=order.service.js.map