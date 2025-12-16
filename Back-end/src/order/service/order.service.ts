import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { OrderRepository } from '../repository/order.repository';
import { ObjectId } from 'mongodb';
import { CreateOrderDto } from '../dto/CreateOrder.dto';
import { CartService } from './../../cart/service/cart.service';
import { PaymentService } from './../../payment/payment.service';
import { NotificationService } from './../../notification/service/notification.service';
import { ProductRepository } from 'src/product/repository/product.repository';

@Injectable()
export class OrderService {
  constructor(
    @Inject(forwardRef(() => PaymentService))
    private readonly paymentService: PaymentService,
    private orderRepository: OrderRepository,
    private cartService: CartService,
    private notificationService: NotificationService,
    private productRepository: ProductRepository,
  ) { }

  async getAllOrders() {
    return await this.orderRepository.getAll();
  }

  async getOrderUser(userId) {
    const userIdObjectId = new ObjectId(userId);
    const orderUser = await this.orderRepository.findOrderUser(userIdObjectId);
    return orderUser;
  }

  async createOrder(createOrderDto: CreateOrderDto) {
    console.log('Creating order with data:', JSON.stringify(createOrderDto, null, 2));
    
    let totalAmount = 0;
    let productIds = [];
    
    // Lấy thông tin product để lưu giá vốn và giá bán tại thời điểm đặt hàng
    const productsWithPrices = await Promise.all(
      createOrderDto.products.map(async (product) => {
        try {
          const productInfo = await this.productRepository.findById(
            product.productId.toString()
          );
          
          if (!productInfo) {
            console.error(`Product not found: ${product.productId}`);
            throw new HttpException(
              `Sản phẩm với ID ${product.productId} không tồn tại`,
              HttpStatus.NOT_FOUND,
            );
          }
          
          totalAmount += product.quantity * product.price;
          productIds.push(product.productId);
          
          // Thêm importPrice vào product order
          return {
            ...product,
            importPrice: productInfo.importPrice || 0,
          };
        } catch (err) {
          console.error('Error processing product:', err);
          if (err instanceof HttpException) {
            throw err;
          }
          throw new HttpException(
            `Lỗi khi xử lý sản phẩm ${product.productId}: ${err.message}`,
            HttpStatus.BAD_REQUEST,
          );
        }
      })
    );
    
    const userIdObject = new Types.ObjectId(createOrderDto.userId);
    const newOrder = { 
      ...createOrderDto, 
      products: productsWithPrices,
      userId: userIdObject, 
      totalAmount 
    };
    
    console.log('Order data to save:', JSON.stringify(newOrder, null, 2));
    
    try {
      if (createOrderDto.isInCart) {
        await this.cartService.deleteCartByProductIdsAndUserId(
          createOrderDto.userId,
          productIds,
        );
      }

      const orderExist = await this.orderRepository.create(newOrder);
      
      // Tạo thông báo cho admin về đơn hàng mới
      try {
        await this.notificationService.createNewOrderNotification(
          orderExist._id.toString(),
          {
            receiver: createOrderDto.shippingInfo?.receiver,
            totalAmount: totalAmount,
          },
        );
      } catch (error) {
        console.error('Error creating notification:', error);
        // Không throw error để không ảnh hưởng đến việc tạo order
      }
      
      console.log('Order created successfully:', orderExist._id);
      return {
        mesage: 'create order successfully',
        orderExist,
      };
    } catch (err) {
      console.error('Error creating order:', err);
      if (err instanceof HttpException) {
        throw err;
      }
      throw new HttpException(
        err.message || 'Create order error',
        HttpStatus.BAD_REQUEST,
      );
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
  async hasUserBoughtProduct(userId: ObjectId, productId: string) {
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

  async getTotalCost() {
    return await this.orderRepository.getTotalCost();
  }

  async getRevenueAndProfit() {
    return await this.orderRepository.getRevenueAndProfit();
  }

  async getRevenueAndProfitByDateRange(startDate: Date, endDate: Date) {
    return await this.orderRepository.getRevenueAndProfitByDateRange(startDate, endDate);
  }
}
