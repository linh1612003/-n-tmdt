import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { OrderService } from './service/order.service';
import { CreateOrderDto } from './dto/CreateOrder.dto';
import { CreateCartDto } from 'src/cart/dto/CreateCart.dto';
import { ShippingInfo } from './schema/order.shema';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @Get('')
  getAllOrders() {
    return this.orderService.getAllOrders();
  }

  @Get(':orderId')
  getOrderById(@Param('orderId') orderId: string) {
    console.log("orderId :", orderId);

    return this.orderService.getOrderById(orderId);
  }

  @Get(':userId/user')
  getOrderUser(@Param('userId') userId: string) {
    return this.orderService.getOrderUser(userId);
  }

  @Post('')
  CreateOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.createOrder(createOrderDto);
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

  @Get('revenue')
  async getTotalRevenue() {
    const totalRevenue = await this.orderService.getTotalRevenue();
    return { totalRevenue };
  }

  @Get('revenue-profit')
  async getRevenueAndProfit(@Query('startDate') startDate?: string, @Query('endDate') endDate?: string) {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const data = await this.orderService.getRevenueAndProfitByDateRange(start, end);
      return data;
    }
    const data = await this.orderService.getRevenueAndProfit();
    return data;
  }
}
