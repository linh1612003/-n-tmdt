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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = require("nodemailer");
require('dotenv').config();
let EmailService = class EmailService {
    constructor() {
        const port = parseInt(process.env.EMAIL_PORT || '587');
        const isSecure = port === 465;
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST || 'smtp.gmail.com',
            port: port,
            secure: isSecure,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });
    }
    async sendOtpEmail(email, otp) {
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
        }
        catch (error) {
            console.error('Error sending email:', error);
            throw new Error('Không thể gửi email. Vui lòng thử lại sau.');
        }
    }
    async sendResetPasswordEmail(email, otp) {
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
        }
        catch (error) {
            console.error('Error sending email:', error);
            throw new Error('Không thể gửi email. Vui lòng thử lại sau.');
        }
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], EmailService);
//# sourceMappingURL=email.service.js.map