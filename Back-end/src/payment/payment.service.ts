import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { Response, Request } from 'express';
import { OrderService } from 'src/order/service/order.service';
const axios = require('axios').default;
const CryptoJS = require('crypto-js');
const querystring = require('querystring');
import * as moment from 'moment';
import * as crypto from 'crypto';
import * as qs from 'qs';

const zaloConfig = {
  app_id: '2553',
  key1: 'PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL',
  key2: 'kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz',
  endpoint: 'https://sb-openapi.zalopay.vn/v2/create',
};

const vnpayConfig = {
<<<<<<< HEAD
  vnp_TmnCode: 'UM6283IE',
  vnp_HashSecret: '38QPRL6J9TW5D503MBDCBCCFB4JEE7N1',
=======
  vnp_TmnCode: 'Y9E4M2CY',
  vnp_HashSecret: '1OP8TFMIIM6QOU5T0LID90XCCWHCIUA2',
>>>>>>> origin/back-up
  vnp_Url: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
  vnp_ReturnUrl: 'http://localhost:3000/vnpay-callback',
};

const sortObject = (params) => {
  return Object.entries(params)
    .sort(([key1], [key2]) => key1.toString().localeCompare(key2.toString()))
    .reduce((result, item) => {
      result = {
        ...result,
        [item[0]]: encodeURIComponent(item[1].toString().replace(/ /g, '+')),
      };

      return result;
    }, {});
};

function buildVnpSignData(obj) {
  // Lấy các trường vnp_xxx, bỏ vnp_SecureHash, vnp_SecureHashType
  const keys = Object.keys(obj)
    .filter(
      (key) =>
        key.startsWith('vnp_') &&
        key !== 'vnp_SecureHash' &&
        key !== 'vnp_SecureHashType',
    )
    .sort();
  return keys
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
    .join('&');
}

@Injectable()
export class PaymentService {
  constructor(
    @Inject(forwardRef(() => OrderService))
    private readonly orderService: OrderService,
  ) { }
  async createZaloPayment(price: number, orderId: string) {
    const embed_data = { orderId: orderId };
    console.log('embed_data in create zalo payment:', embed_data);

    const items = [{}];
    const transID = Math.floor(Math.random() * 1000000);
    const order = {
      app_id: zaloConfig.app_id,
      app_trans_id: `${moment().format('YYMMDD')}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
      app_user: 'user123',
      app_time: Date.now(), // miliseconds
      item: JSON.stringify(items),
      embed_data: JSON.stringify(embed_data),
      amount: price,
      description: `VNMK - Payment for the order #${transID}`,
      bank_code: '',
      mac: '',
      // cho url vào đây
      callback_url:
        'https://be6b-112-197-200-142.ngrok-free.app/api/payment/zalopayCallback',
    };

    // appid|app_trans_id|appuser|amount|apptime|embeddata|item
    const data =
      zaloConfig.app_id +
      '|' +
      order.app_trans_id +
      '|' +
      order.app_user +
      '|' +
      order.amount +
      '|' +
      order.app_time +
      '|' +
      order.embed_data +
      '|' +
      order.item;
    order.mac = CryptoJS.HmacSHA512(data, zaloConfig.key1).toString();

    try {
      const res = await axios.post(zaloConfig.endpoint, null, {
        params: order,
      });
      return res.data;
    } catch (err) {
      console.log(err);
    }
  }

  async handleCallbackZaloPayment(req: Request, res: Response) {
    let result = {
      return_code: 0,
      return_message: '',
    };

    try {
      let dataStr = req.body.data;
      let reqMac = req.body.mac;

      let mac = CryptoJS.HmacSHA512(dataStr, zaloConfig.key2).toString();

      // kiểm tra callback hợp lệ (đến từ ZaloPay server)
      if (reqMac != mac) {
        result.return_code = -1;
        result.return_message = 'mac not equal';
      } else {
        const key2 = zaloConfig.key2;
        let dataJson = JSON.parse(dataStr);
        const embed_data = JSON.parse(dataJson.embed_data);

        await this.orderService.updatePaymentStatus(embed_data.orderId, '');

        result.return_code = 1;
        result.return_message = 'success';
      }
    } catch (ex) {
      result.return_message = ex.message;
    }

    res.json(result);
    return result;
  }

<<<<<<< HEAD
    async createVNPayPayment(price: number, orderId: string) {
=======
  async createVNPayPayment(price: number, orderId: string) {
>>>>>>> origin/back-up
    const ipAddr = '113.23.45.67';

    const tmnCode = vnpayConfig.vnp_TmnCode;
    const secretKey = vnpayConfig.vnp_HashSecret;
    let vnpUrl = vnpayConfig.vnp_Url;
    const returnUrl = vnpayConfig.vnp_ReturnUrl;

    const date = new Date();

    const createDate = moment(date).format('YYYYMMDDHHmmss');
    const expiredDate = moment(date).add(10, 'm').format('YYYYMMDDHHmmss');
    const amount = price;

    // Sinh txnRef và lưu vào đơn hàng
    const txnRef = String(orderId).replace(/[^a-zA-Z0-9]/g, '').slice(0, 20);
    await this.orderService.setVNPayRef(orderId, txnRef);

    const orderInfo = `Thanh toan don hang ${txnRef}`;
    const orderType = 'other';
    const currCode = 'VND';
    let vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_Locale'] = 'vn';
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = txnRef;
    vnp_Params['vnp_OrderInfo'] = orderInfo;
    vnp_Params['vnp_OrderType'] = orderType;
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    vnp_Params['vnp_ExpireDate'] = expiredDate;

    vnp_Params = sortObject(vnp_Params);

    const signData = qs.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');
    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + qs.stringify(vnp_Params, { encode: false });

    return { paymentUrl: vnpUrl };
  }

  async handleCallbackVNPay(req: Request, res: Response) {
    const vnp_Params = req.query;
    const secureHash = vnp_Params['vnp_SecureHash'] as string;
    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    console.log('VNPay callback raw params:', vnp_Params);
    const signData = buildVnpSignData(vnp_Params);
    console.log('VNPay callback signData:', signData);
    const hmac = CryptoJS.HmacSHA512(signData, vnpayConfig.vnp_HashSecret);
    const signed = hmac.toString(CryptoJS.enc.Hex);
    console.log('VNPay callback signed:', signed);
    console.log('VNPay callback received vnp_SecureHash:', secureHash);

    const txnRef = vnp_Params['vnp_TxnRef'] as string;
    const rspCode = vnp_Params['vnp_ResponseCode'] as string;
    console.log('VNPay callback txnRef:', txnRef);
    console.log('VNPay callback rspCode:', rspCode);

    // Tìm orderId từ txnRef
    const orderId = await this.orderService.findOrderIdByVNPayRef(txnRef);
    console.log('VNPay callback orderId:', orderId);

    if (secureHash === signed) {
      if (rspCode === '00' && orderId) {
        // Cập nhật trạng thái thanh toán cho đơn hàng giống ZaloPay
        const updateResult = await this.orderService.updatePaymentStatus(orderId.toString(), 'vnpay_callback');
        console.log('VNPay callback update result:', updateResult);
        res.redirect('http://localhost:3000/vnpay-callback');
      } else {
        res.redirect('http://localhost:3000/error-page');
      }
    } else {
      res.redirect('http://localhost:3000/error-page');
    }
  }
}
