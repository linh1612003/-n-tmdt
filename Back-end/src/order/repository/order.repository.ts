import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
<<<<<<< HEAD
import { Model, Types } from 'mongoose';
=======
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
>>>>>>> origin/back-up
import { Order } from '../schema/order.shema';
import { ShippingInfo } from './../schema/order.shema';
@Injectable()
export class OrderRepository {
  constructor(
    @InjectModel(Order.name)
    private orderModel: Model<Order>,
  ) { }

  async getAll() {
<<<<<<< HEAD
    return await this.orderModel.find();
  }

  async findOrderUser(userId: Types.ObjectId) {
    const userIdString = userId.toString();
    console.log('findOrderUser - searching for userId:', userIdString);
    console.log('findOrderUser - userId type:', userId.constructor.name);
    
    // Query MongoDB với ObjectId - cách chuẩn
    const orders = await this.orderModel.find({ userId: userId });
    
    console.log('findOrderUser - query returned:', orders.length, 'orders');
    
    // Log tất cả userIds unique để kiểm tra xem có userId nào khác không
    const uniqueUserIds = new Set();
    const userIdCounts = new Map();
    
    orders.forEach((order, index) => {
      if (order.userId) {
        const orderUserIdStr = String(order.userId).trim().toLowerCase();
        uniqueUserIds.add(orderUserIdStr);
        userIdCounts.set(orderUserIdStr, (userIdCounts.get(orderUserIdStr) || 0) + 1);
        
        // Log 10 orders đầu tiên để debug
        if (index < 10) {
          console.log(`findOrderUser - Order ${index + 1} userId:`, orderUserIdStr, 'matches:', orderUserIdStr === userIdString.toLowerCase());
        }
      }
    });
    
    console.log('findOrderUser - UNIQUE userIds in result:', Array.from(uniqueUserIds));
    console.log('findOrderUser - Total unique userIds:', uniqueUserIds.size);
    console.log('findOrderUser - UserId counts:', Object.fromEntries(userIdCounts));
    
    // Nếu có nhiều hơn 1 userId, có vấn đề!
    if (uniqueUserIds.size > 1) {
      console.error('findOrderUser - ERROR: Query returned orders from multiple users!', {
        targetUserId: userIdString,
        foundUserIds: Array.from(uniqueUserIds),
        totalOrders: orders.length,
        userIdCounts: Object.fromEntries(userIdCounts)
      });
    }
    
    // CRITICAL: Filter chặt chẽ để đảm bảo 100% chỉ lấy đơn hàng của user này
    const targetUserIdNormalized = userIdString.trim().toLowerCase();
    const filteredOrders = orders.filter(order => {
      if (!order || !order.userId) {
        console.warn('findOrderUser - Order missing userId:', order?._id?.toString());
        return false;
      }
      
      // Normalize order userId để so sánh
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
=======
    return await this.orderModel.find().sort({ orderDate: -1 });
  }

  async findOrderUser(userId: ObjectId) {
    return await this.orderModel.find({ userId });
>>>>>>> origin/back-up
  }
  async create(newOrder: any) {
    return this.orderModel.create(newOrder);
  }

  async findOrderSuccess(data: any) {
    console.log('data in repo:', data);
    return await this.orderModel.find({
      userId: data.userId,
      status: 'success',
      products: {
        $elemMatch: { productId: data.productId },
      },
    });
  }

  async findById(id: string) {
    return await this.orderModel.findById(id);
  }

  async updateShippingInfo(orderId: string, shippingInfo: any) {
    return await this.orderModel.findByIdAndUpdate(
      orderId,
      { shippingInfo },
      { new: true },
    );
  }
  async updatePaymentStatus(orderId: string, paymentStatus: string) {
    return await this.orderModel.findByIdAndUpdate(
      orderId,
      { paymentStatus },
      { new: true },
    );
  }

  async updateStatus(orderId: string) {
    return await this.orderModel.findByIdAndUpdate(
      orderId,
      { status: 'success' },
      { new: true },
    );
  }
  async updateShippingStatus(orderId: string, shippingStatus: string) {
    return await this.orderModel.findByIdAndUpdate(
      orderId,
      { shippingStatus },
      { new: true },
    );
  }

  async setVNPayRef(orderId: string, txnRef: string) {
    return await this.orderModel.findByIdAndUpdate(
      orderId,
      { vnpTxnRef: txnRef },
      { new: true },
    );
  }

  async findOrderIdByVNPayRef(txnRef: string) {
    const order = await this.orderModel.findOne({ vnpTxnRef: txnRef });
    return order ? order._id : null;
  }

  async getTotalRevenue() {
    // Tính tổng doanh thu từ các đơn hàng đã hoàn thành (status: 'success')
    const result = await this.orderModel.aggregate([
      { $match: { status: 'success' } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
    ]);
    return result[0]?.totalRevenue || 0;
  }
<<<<<<< HEAD
=======

  async getTotalCost() {
    // Tính tổng giá vốn từ các đơn hàng đã hoàn thành
    const orders = await this.orderModel.find({ status: 'success' });
    let totalCost = 0;
    
    orders.forEach((order) => {
      if (order.products && Array.isArray(order.products)) {
        order.products.forEach((product: any) => {
          const importPrice = product.importPrice || 0;
          const quantity = product.quantity || 0;
          totalCost += importPrice * quantity;
        });
      }
    });
    
    return totalCost;
  }

  async getRevenueAndProfit() {
    // Tính cả doanh thu, giá vốn và lợi nhuận
    const orders = await this.orderModel.find({ status: 'success' });
    let totalRevenue = 0;
    let totalCost = 0;
    
    orders.forEach((order) => {
      totalRevenue += order.totalAmount || 0;
      
      if (order.products && Array.isArray(order.products)) {
        order.products.forEach((product: any) => {
          const importPrice = product.importPrice || 0;
          const quantity = product.quantity || 0;
          totalCost += importPrice * quantity;
        });
      }
    });
    
    const profit = totalRevenue - totalCost;
    
    return {
      totalRevenue,
      totalCost,
      profit,
    };
  }

  async getRevenueAndProfitByDateRange(startDate: Date, endDate: Date) {
    // Tính cả doanh thu, giá vốn và lợi nhuận theo khoảng thời gian
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    
    const orders = await this.orderModel.find({
      status: 'success',
      orderDate: {
        $gte: start,
        $lte: end,
      },
    });
    
    let totalRevenue = 0;
    let totalCost = 0;
    let orderCount = orders.length;
    
    orders.forEach((order) => {
      totalRevenue += order.totalAmount || 0;
      
      if (order.products && Array.isArray(order.products)) {
        order.products.forEach((product: any) => {
          const importPrice = product.importPrice || 0;
          const quantity = product.quantity || 0;
          totalCost += importPrice * quantity;
        });
      }
    });
    
    const profit = totalRevenue - totalCost;
    
    return {
      totalRevenue,
      totalCost,
      profit,
      orderCount,
      startDate: start,
      endDate: end,
    };
  }
>>>>>>> origin/back-up
}
