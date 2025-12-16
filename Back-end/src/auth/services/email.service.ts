import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
require('dotenv').config();

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    const port = parseInt(process.env.EMAIL_PORT || '587');
    const isSecure = port === 465;
    
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: port,
      secure: isSecure, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        // Không kiểm tra chứng chỉ SSL trong môi trường development
        // Trong production, nên bỏ dòng này để đảm bảo bảo mật
        rejectUnauthorized: false,
      },
    });
  }

  async sendOtpEmail(email: string, otp: string): Promise<void> {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Mã xác thực đăng ký tài khoản',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Xác thực đăng ký tài khoản</h2>
          <p>Xin chào,</p>
          <p>Bạn đã yêu cầu đăng ký tài khoản. Mã xác thực của bạn là:</p>
          <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="color: #007bff; font-size: 32px; letter-spacing: 5px; margin: 0;">${otp}</h1>
          </div>
          <p>Mã này có hiệu lực trong 10 phút.</p>
          <p>Nếu bạn không yêu cầu đăng ký, vui lòng bỏ qua email này.</p>
          <p style="color: #666; font-size: 12px; margin-top: 30px;">Trân trọng,<br>Đội ngũ hỗ trợ</p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Không thể gửi email. Vui lòng thử lại sau.');
    }
  }

  async sendResetPasswordEmail(email: string, otp: string): Promise<void> {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Mã xác thực đặt lại mật khẩu',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Đặt lại mật khẩu</h2>
          <p>Xin chào,</p>
          <p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Mã xác thực của bạn là:</p>
          <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="color: #dc3545; font-size: 32px; letter-spacing: 5px; margin: 0;">${otp}</h1>
          </div>
          <p>Mã này có hiệu lực trong 10 phút.</p>
          <p><strong>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này và kiểm tra bảo mật tài khoản của bạn.</strong></p>
          <p style="color: #666; font-size: 12px; margin-top: 30px;">Trân trọng,<br>Đội ngũ hỗ trợ</p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Không thể gửi email. Vui lòng thử lại sau.');
    }
  }
}

