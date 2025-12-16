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
exports.OrderRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const order_shema_1 = require("../schema/order.shema");
let OrderRepository = class OrderRepository {
    constructor(orderModel) {
        this.orderModel = orderModel;
    }
    async getAll() {
        return await this.orderModel.find();
    }
    async findOrderUser(userId) {
        const userIdString = userId.toString();
        console.log('findOrderUser - searching for userId:', userIdString);
        console.log('findOrderUser - userId type:', userId.constructor.name);
        const orders = await this.orderModel.find({ userId: userId });
        console.log('findOrderUser - query returned:', orders.length, 'orders');
        const uniqueUserIds = new Set();
        const userIdCounts = new Map();
        orders.forEach((order, index) => {
            if (order.userId) {
                const orderUserIdStr = String(order.userId).trim().toLowerCase();
                uniqueUserIds.add(orderUserIdStr);
                userIdCounts.set(orderUserIdStr, (userIdCounts.get(orderUserIdStr) || 0) + 1);
                if (index < 10) {
                    console.log(`findOrderUser - Order ${index + 1} userId:`, orderUserIdStr, 'matches:', orderUserIdStr === userIdString.toLowerCase());
                }
            }
        });
        console.log('findOrderUser - UNIQUE userIds in result:', Array.from(uniqueUserIds));
        console.log('findOrderUser - Total unique userIds:', uniqueUserIds.size);
        console.log('findOrderUser - UserId counts:', Object.fromEntries(userIdCounts));
        if (uniqueUserIds.size > 1) {
            console.error('findOrderUser - ERROR: Query returned orders from multiple users!', {
                targetUserId: userIdString,
                foundUserIds: Array.from(uniqueUserIds),
                totalOrders: orders.length,
                userIdCounts: Object.fromEntries(userIdCounts)
            });
        }
        const targetUserIdNormalized = userIdString.trim().toLowerCase();
        const filteredOrders = orders.filter(order => {
            if (!order || !order.userId) {
                console.warn('findOrderUser - Order missing userId:', order?._id?.toString());
                return false;
            }
            const orderUserIdStr = String(order.userId).trim().toLowerCase();
            const matches = orderUserIdStr === targetUserIdNormalized;
            if (!matches) {
                console.error('findOrderUser - SECURITY: Order filtered out - userId mismatch!', {
                    orderId: order._id?.toString(),
                    orderUserId: String(order.userId),
                    orderUserIdNormalized: orderUserIdStr,
                    targetUserId: userIdString,
                    targetUserIdNormalized
                });
            }
            return matches;
        });
        console.log('findOrderUser - filtered orders AFTER filter:', filteredOrders.length);
        if (orders.length !== filteredOrders.length) {
            console.error('findOrderUser - WARNING: Some orders were filtered out!', {
                original: orders.length,
                filtered: filteredOrders.length,
                filteredOut: orders.length - filteredOrders.length
            });
        }
        return filteredOrders;
    }
    async create(newOrder) {
        return this.orderModel.create(newOrder);
    }
    async findOrderSuccess(data) {
        console.log('data in repo:', data);
        return await this.orderModel.find({
            userId: data.userId,
            status: 'success',
            products: {
                $elemMatch: { productId: data.productId },
            },
        });
    }
    async findById(id) {
        return await this.orderModel.findById(id);
    }
    async updateShippingInfo(orderId, shippingInfo) {
        return await this.orderModel.findByIdAndUpdate(orderId, { shippingInfo }, { new: true });
    }
    async updatePaymentStatus(orderId, paymentStatus) {
        return await this.orderModel.findByIdAndUpdate(orderId, { paymentStatus }, { new: true });
    }
    async updateStatus(orderId) {
        return await this.orderModel.findByIdAndUpdate(orderId, { status: 'success' }, { new: true });
    }
    async updateShippingStatus(orderId, shippingStatus) {
        return await this.orderModel.findByIdAndUpdate(orderId, { shippingStatus }, { new: true });
    }
    async setVNPayRef(orderId, txnRef) {
        return await this.orderModel.findByIdAndUpdate(orderId, { vnpTxnRef: txnRef }, { new: true });
    }
    async findOrderIdByVNPayRef(txnRef) {
        const order = await this.orderModel.findOne({ vnpTxnRef: txnRef });
        return order ? order._id : null;
    }
    async getTotalRevenue() {
        const result = await this.orderModel.aggregate([
            { $match: { status: 'success' } },
            { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
        ]);
        return result[0]?.totalRevenue || 0;
    }
};
exports.OrderRepository = OrderRepository;
exports.OrderRepository = OrderRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(order_shema_1.Order.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], OrderRepository);
//# sourceMappingURL=order.repository.js.map