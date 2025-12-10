import { Controller, Get, Post, Query, Req, Res } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) { }

  @Get('/zalo-pay')
  async createZaloPayment(@Query() data: any, @Req() req, @Res() res) { }

  @Post('/zalopayCallback')
  async handleCallbackZaloPayment(@Req() req, @Res() res) {
    const result = await this.paymentService.handleCallbackZaloPayment(
      req,
      res,
    );
  }

  @Get('/vnpay')
  async createVNPayPayment(@Query() data: any, @Req() req, @Res() res) {
    const { price, orderId } = data;
    const result = await this.paymentService.createVNPayPayment(price, orderId);
    res.json(result);
  }

  @Get('/vnpayCallback')
  async handleCallbackVNPay(@Req() req, @Res() res) {
    await this.paymentService.handleCallbackVNPay(req, res);
  }
}
