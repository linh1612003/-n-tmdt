import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { Order } from '../schema/order.shema';
import { ShippingInfo } from './../schema/order.shema';
@Injectable()
export class OrderRepository {
  constructor(
    @InjectModel(Order.name)
    private orderModel: Model<Order>,
  ) { }

  async getAll() {
    return await this.orderModel.find().sort({ orderDate: -1 });
  }

  async findOrderUser(userId: ObjectId) {
    return await this.orderModel.find({ userId });
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
}
