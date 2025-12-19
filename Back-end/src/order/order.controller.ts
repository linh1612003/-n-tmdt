import { Body, Controller, Get, Param, Post, Put, Req, ForbiddenException } from '@nestjs/common';
import { OrderService } from './service/order.service';
import { CreateOrderDto } from './dto/CreateOrder.dto';
import { CreateCartDto } from 'src/cart/dto/CreateCart.dto';
import { ShippingInfo } from './schema/order.shema';
import { Request } from 'express';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @Get('')
  getAllOrders() {
    return this.orderService.getAllOrders();
  }

  @Get('revenue')
  async getTotalRevenue() {
    const totalRevenue = await this.orderService.getTotalRevenue();
    return { totalRevenue };
  }

  // Route cụ thể phải đặt trước route generic
  @Get(':userId/user')
  getOrderUser(@Param('userId') userId: string, @Req() req: Request) {
    // Lấy userId từ token (đã được verify bởi middleware)
    const tokenUserId = (req as any).user?.userId;
    
    if (!tokenUserId) {
      throw new ForbiddenException('Không tìm thấy thông tin người dùng từ token');
    }
    
    // Validate: userId trong URL phải khớp với userId trong token
    // Đảm bảo user chỉ có thể xem đơn hàng của chính họ
    const tokenUserIdStr = String(tokenUserId).trim();
    const paramUserIdStr = String(userId).trim();
    
    if (tokenUserIdStr !== paramUserIdStr) {
      throw new ForbiddenException('Bạn không có quyền xem đơn hàng của người dùng khác');
    }
    
    // Sử dụng userId từ token để đảm bảo bảo mật
    return this.orderService.getOrderUser(tokenUserIdStr);
  }

  @Get(':orderId')
  getOrderById(@Param('orderId') orderId: string) {
    console.log("orderId :", orderId);

    return this.orderService.getOrderById(orderId);
  }

  @Post('')
  async CreateOrder(@Body() createOrderDto: CreateOrderDto) {
    try {
      return await this.orderService.createOrder(createOrderDto);
    } catch (error) {
      console.error('Error in CreateOrder controller:', error);
      throw error;
    }
  }

  @Put('/:orderId/status')
  updateStatus(
    @Param('orderId') orderId: string,
    @Body('paymentMethod') paymentMethod: string,
  ) {
    return this.orderService.updatePaymentStatus(orderId, paymentMethod);
  }
  @Put('/:orderId/shipping-info')
  updateShippingInfo(@Param('orderId') orderId: string, @Body() data: any) {
    return this.orderService.updateShippingInfo(orderId, data);
  }

  @Put('/:orderId/shipping-status')
  updateShippingStatus(
    @Param('orderId') orderId: string,
    @Body('shippingStatus') shippingStatus: string,
  ) {
    return this.orderService.updateShippingStatus(orderId, shippingStatus);
  }
}
