import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { OrderRepository } from '../repository/order.repository';
import { CreateOrderDto } from '../dto/CreateOrder.dto';
import { CartService } from './../../cart/service/cart.service';
import { PaymentService } from './../../payment/payment.service';

@Injectable()
export class OrderService {
  constructor(
    @Inject(forwardRef(() => PaymentService))
    private readonly paymentService: PaymentService,
    private orderRepository: OrderRepository,
    private cartService: CartService,
  ) { }

  async getAllOrders() {
    return await this.orderRepository.getAll();
  }

  async getOrderUser(userId) {
    console.log('getOrderUser - userId received:', userId, 'type:', typeof userId);
    
    if (!userId) {
      throw new HttpException('UserId is required', HttpStatus.BAD_REQUEST);
    }
    
    // Normalize userId: đảm bảo là string và trim
    const normalizedUserId = String(userId).trim();
    
    // Validate userId format (MongoDB ObjectId có 24 ký tự hex)
    if (!/^[0-9a-fA-F]{24}$/.test(normalizedUserId)) {
      console.error('getOrderUser - Invalid userId format:', normalizedUserId);
      throw new HttpException('Invalid userId format', HttpStatus.BAD_REQUEST);
    }
    
    // Sử dụng Types.ObjectId từ mongoose
    let userIdObjectId: Types.ObjectId;
    try {
      userIdObjectId = new Types.ObjectId(normalizedUserId);
    } catch (error) {
      console.error('getOrderUser - Error creating ObjectId:', error);
      throw new HttpException('Invalid userId format', HttpStatus.BAD_REQUEST);
    }
    
    console.log('getOrderUser - converted ObjectId:', userIdObjectId.toString());
    console.log('getOrderUser - requesting orders for userId:', normalizedUserId);
    
    // Repository sẽ query và filter
    const orderUser = await this.orderRepository.findOrderUser(userIdObjectId);
    console.log('getOrderUser - orders found from repository:', orderUser?.length || 0);
    
    // Final filter: Đảm bảo 100% chỉ trả về orders của user này
    const targetUserIdStr = normalizedUserId.toLowerCase().trim();
    const finalFilteredOrders = (orderUser || []).filter(order => {
      if (!order || !order.userId) {
        console.warn('getOrderUser - Order missing userId:', order?._id?.toString());
        return false;
      }
      
      // Normalize cả hai để so sánh
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
    
    // Log một vài đơn hàng cuối cùng để verify
    if (finalFilteredOrders.length > 0) {
      console.log('getOrderUser - Sample final orders userIds:');
      finalFilteredOrders.slice(0, 3).forEach((order, index) => {
        console.log(`  Final Order ${index + 1} userId:`, String(order.userId));
      });
    }
    
    return finalFilteredOrders;
  }

  async createOrder(createOrderDto: CreateOrderDto) {
    let totalAmount = 0;
    let productIds = [];
    createOrderDto.products.forEach((product) => {
      totalAmount += product.quantity * product.price;
      productIds.push(product.productId);
    });
    const userIdObject = new Types.ObjectId(createOrderDto.userId);
    const newOrder = { ...createOrderDto, userId: userIdObject, totalAmount };
    try {
      if (createOrderDto.isInCart) {
        await this.cartService.deleteCartByProductIdsAndUserId(
          createOrderDto.userId,
          productIds,
        );
      }

      const orderExist = await this.orderRepository.create(newOrder);
      return {
        mesage: 'create order successfully',
        orderExist,
      };
    } catch (err) {
      console.error('Create order error:', err);
      const errorMessage = err.message || 'Create order error';
      throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
    }
  }

  async getOrderById(orderId: string) {
    return this.orderRepository.findById(orderId);
  }

  async getUrlPaymentOrder(orderId: string) {
    try {
      const orderExist = await this.orderRepository.findById(orderId);
      if (!orderExist) {
        throw new Error('Order not found');
      }

      const paymentInf = await this.paymentService.createZaloPayment(
        orderExist.totalAmount,
        orderId,
      );

      if (paymentInf) {
        return { success: true, paymentInf };
      } else {
        throw new Error('Failed to create payment URL');
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async updateShippingInfo(orderId: string, data: any) {
    const orderExist = await this.orderRepository.findById(orderId);
    if (!orderExist) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }
    try {
      await this.orderRepository.updateShippingInfo(orderId, data.shippingInfo);
    } catch (error) {
      console.log(error);
    }
    return {
      mesage: 'update Shipping information successfully',
    };
  }

  async updatePaymentStatus(orderId: string, paymentMethod: string) {
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
        throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
      }
      const result = await this.paymentService.createVNPayPayment(orderExist.totalAmount, orderId);
      return {
        paymentUrl: result.paymentUrl,
      };
    }
    if (paymentMethod === 'zalopay') {
      const orderExist = await this.orderRepository.findById(orderId);
      if (!orderExist) {
        throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
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
    // await this.orderRepository.updatePaymentStatus(orderId, 'pending');
    return {
      mesage: 'Update status to pending',
    };
  }

  async updateStatus(orderId: string) {
    const orderExist = await this.orderRepository.findById(orderId);
    if (!orderExist) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }
    try {
      await this.orderRepository.updateStatus(orderId);
      return {
        mesage: 'Update status success',
      };
    } catch (err) {
      throw new HttpException(
        'Update status error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async updateShippingStatus(orderId: string, shippingStatus: string) {
    const orderExist = await this.orderRepository.findById(orderId);
    if (!orderExist) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }

    try {
      await this.orderRepository.updateShippingStatus(orderId, shippingStatus);
      if (shippingStatus == 'đã giao hàng') {
        await this.updateStatus(orderId);
      }
      return {
        mesage: 'Update shipping status success',
      };
    } catch (err) {
      throw new HttpException(
        'Update shipping status error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async hasUserBoughtProduct(userId: Types.ObjectId, productId: string) {
    const data = { userId, productId, status: 'success' };
    const orderExist = await this.orderRepository.findOrderSuccess(data);
    return orderExist;
  }

  async updatePaymentStatusVNPay(orderId: string, paymentStatus: string) {
    const orderExist = await this.orderRepository.findById(orderId);
    if (!orderExist) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }
    await this.orderRepository.updatePaymentStatus(orderId, paymentStatus);
    return {
      message: 'Update VNPay payment status success',
    };
  }

  async setVNPayRef(orderId: string, txnRef: string) {
    return this.orderRepository.setVNPayRef(orderId, txnRef);
  }

  async findOrderIdByVNPayRef(txnRef: string) {
    return this.orderRepository.findOrderIdByVNPayRef(txnRef);
  }

  async getTotalRevenue() {
    return await this.orderRepository.getTotalRevenue();
  }
}
