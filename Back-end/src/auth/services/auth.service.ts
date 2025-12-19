import { HttpException, HttpStatus, Injectable, Res } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from '../dto/register-user.dto';
import { LoginUserDto } from '../dto/login.dto';
<<<<<<< HEAD
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { AuthRepository } from '../repository/auth.repository';
import { OtpRepository } from '../repository/otp.repository';
import { EmailService } from './email.service';
=======
import { AuthRepository } from '../repository/auth.repository';
>>>>>>> origin/back-up
import { Response } from 'express';
import { User } from '../schemas/user.schema';
require('dotenv').config();

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
<<<<<<< HEAD
    private readonly otpRepository: OtpRepository,
    private readonly emailService: EmailService,
    private jwtService: JwtService,
  ) { }
=======
    private jwtService: JwtService,
  ) {}
>>>>>>> origin/back-up

  async loginWithGoogle(profile_google: any) {
    const displayName = profile_google.displayName;
    const username = profile_google.id;
    const avaUrl = profile_google.photos[0].value;

    let user = await this.authRepository.findUserByGoogleType(username);
    if (!user) {
      user = await this.authRepository.createUserByGoogleType(
        username,
        displayName,
        avaUrl,
      );
    }
    const token = await this.genarateToken(user.username, user._id.toString());
    return {
      access_token: token.accessToken,
      refresh_token: token.refreshToken,
      userId: user._id.toString(),
      role: user.role,
    };
  }

  async loginWithFacebook(profile_facebook: any) {
    const displayName =
      profile_facebook._json.last_name +
      ' ' +
      profile_facebook._json.first_name;
    const username = profile_facebook._json.id;

    let user = await this.authRepository.findUserByFacebookType(username);

    if (!user) {
      user = await this.authRepository.createUserByFacebookType(
        username,
        displayName,
      );
    }
    const token = await this.genarateToken(user.username, user._id.toString());

    return {
      access_token: token.accessToken,
      refresh_token: token.refreshToken,
      userId: user._id.toString(),
      role: user.role,
    };
  }

  async register(registerUserDto: RegisterUserDto) {
    const user = await this.authRepository.findByUserName(
      registerUserDto.username,
    );

    if (user) {
      throw new HttpException('Username already exists', HttpStatus.CONFLICT);
    }
    const hashedPassword = await this.haspassword(registerUserDto.password);

    const newUser = await this.authRepository.createUser({
      ...registerUserDto,
      password: hashedPassword,
    });
    return {
      message: 'Register user success',
    };
  }

  async login(loginUserDto: LoginUserDto, @Res() res: Response) {
    const user = await this.authRepository.findByUserName(
      loginUserDto.username,
    );

    if (!user) {
      throw new HttpException(
        'User name is not exist',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const isMatch = await bcrypt.compare(loginUserDto.password, user.password);
    if (!isMatch) {
      throw new HttpException(
        'Password is not correct',
        HttpStatus.UNAUTHORIZED,
      );
    }

    // update access token and refresh token
    const token = await this.genarateToken(user.username, user._id.toString());

    res.cookie('refreshToken', token.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
    });

    return res.status(HttpStatus.OK).json({
      access_token: token.accessToken,
      refresh_token: token.refreshToken,
      userId: user._id.toString(),
      role: user.role,
    });
  }

  async refreshToken(refreshToken: string) {
    try {
      const verify = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.REFRESH_TOKEN_SECRET,
      });
      return this.genarateToken(verify.username, verify.userId);
    } catch (err) {
      throw new HttpException(
        err.message + ' -- Refresh token is not valid',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async genarateToken(username: string, userId: string) {
    const accessToken = await this.jwtService.signAsync(
      { userId },
      {
        secret: process.env.ACCESS_TOKEN_SECRET,
        expiresIn: '8h',
      },
    );
    const refreshToken = await this.jwtService.signAsync(
      { userId },
      {
        secret: process.env.REFRESH_TOKEN_SECRET,
        expiresIn: '7d',
      },
    );

    await this.authRepository.findUserAndUpdateToken(
      username,
      accessToken,
      refreshToken,
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  async getUserById(userId: string) {
    const user = await this.authRepository.findById(userId);

    return this.getExistingUser(user, userId);
  }

  getExistingUser(user: User, userId: string) {
    return {
      userId,
      type: user.type,
      userName: user.username,
      displayName: user.displayName,
      avaUrl: user.avaUrl,
      facebookId: user.facebookId,
      contactPhone: user.contactPhone,
      address: user.address,
      addressDetail: user.addressDetail,
    };
  }

  private async haspassword(password: string) {
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }
<<<<<<< HEAD

  async checkEmailAndSendOtp(email: string) {
    // Normalize email: trim và lowercase để tránh lỗi case-sensitive và khoảng trắng
    const normalizedEmail = email.trim().toLowerCase();

    // Debug log
    console.log('[checkEmailAndSendOtp] Input email:', email);
    console.log('[checkEmailAndSendOtp] Normalized email:', normalizedEmail);

    // Kiểm tra email đã tồn tại chưa (tìm với cả email gốc và normalized)
    let existingUser = await this.authRepository.findByUserName(normalizedEmail);

    // Nếu không tìm thấy với normalized, thử tìm với email gốc (trim)
    if (!existingUser) {
      existingUser = await this.authRepository.findByUserName(email.trim());
    }

    // Debug: Tìm tất cả users có username chứa email để xem format
    const allUsersWithEmail = await this.authRepository.findAllUsersContainingEmail(normalizedEmail);
    console.log('[checkEmailAndSendOtp] All users containing email:', allUsersWithEmail.length);
    if (allUsersWithEmail.length > 0) {
      console.log('[checkEmailAndSendOtp] Sample usernames:', allUsersWithEmail.slice(0, 3).map(u => u.username));
    }

    console.log('[checkEmailAndSendOtp] Found user:', existingUser ? 'YES' : 'NO');
    if (existingUser) {
      console.log('[checkEmailAndSendOtp] User username in DB:', existingUser.username);
    }

    // Nếu email không tồn tại, tạo user mới với email đó (chưa có password)
    if (!existingUser) {
      console.log('[checkEmailAndSendOtp] Email chưa tồn tại, tạo user mới với email:', normalizedEmail);
      existingUser = await this.authRepository.createUser({
        type: 'LOCAL',
        username: normalizedEmail,
        password: '', // Chưa có password, sẽ được set khi verify OTP
        displayName: '',
      });
      console.log('[checkEmailAndSendOtp] Đã tạo user mới với ID:', existingUser._id);
    }

    // Kiểm tra xem email đã được đăng ký đầy đủ chưa (đã có password)
    if (existingUser.password && existingUser.password !== '' && existingUser.password !== 'access_token' && existingUser.password !== 'refresh_token') {
      throw new HttpException(
        'Email này đã được đăng ký. Vui lòng đăng nhập.',
        HttpStatus.CONFLICT,
      );
    }

    // Nếu email tồn tại nhưng chưa có password, gửi OTP để đăng ký
    // Tạo mã OTP 6 chữ số
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // OTP có hiệu lực trong 10 phút
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    // Lưu OTP vào database (dùng normalized email để đảm bảo consistency)
    await this.otpRepository.createOtp(normalizedEmail, otp, expiresAt, 'register');

    // Gửi email OTP (dùng email gốc đã trim)
    await this.emailService.sendOtpEmail(email.trim(), otp);

    return {
      message: 'Mã OTP đã được gửi đến email của bạn. Vui lòng kiểm tra email.',
    };
  }

  async verifyOtpAndRegister(verifyOtpDto: any) {
    const { email, otp, username, displayName, password } = verifyOtpDto;

    // Normalize email và username
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedUsername = username.trim().toLowerCase();

    // Kiểm tra email có khớp với username không
    if (normalizedEmail !== normalizedUsername) {
      throw new HttpException(
        'Email không khớp với username',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Kiểm tra email đã tồn tại chưa (phải tồn tại mới được đăng ký)
    const existingUser = await this.authRepository.findByUserName(normalizedUsername);
    if (!existingUser) {
      throw new HttpException(
        'Email này không tồn tại. Vui lòng kiểm tra lại email.',
        HttpStatus.NOT_FOUND,
      );
    }

    // Kiểm tra xem email đã được đăng ký đầy đủ chưa (có password chưa)
    if (existingUser.password && existingUser.password !== '') {
      throw new HttpException(
        'Email này đã được đăng ký. Vui lòng đăng nhập.',
        HttpStatus.CONFLICT,
      );
    }

    // Kiểm tra OTP hợp lệ (dùng normalized email)
    const validOtp = await this.otpRepository.findValidOtp(normalizedEmail, otp, 'register');

    if (!validOtp) {
      throw new HttpException(
        'Mã OTP không hợp lệ hoặc đã hết hạn. Vui lòng thử lại.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Hash password
    const hashedPassword = await this.haspassword(password);

    // Cập nhật thông tin user đã tồn tại (thêm password và displayName)
    await this.authRepository.updateUser(normalizedUsername, {
      displayName,
      password: hashedPassword,
    });

    // Đánh dấu OTP đã sử dụng
    await this.otpRepository.markOtpAsUsed(normalizedEmail, otp);

    // Lấy lại user đã cập nhật
    const updatedUser = await this.authRepository.findByUserName(normalizedUsername);

    return {
      message: 'Đăng ký thành công',
      userId: updatedUser._id.toString(),
    };
  }

  async requestPasswordReset(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;

    // Kiểm tra email có tồn tại không
    const user = await this.authRepository.findByUserName(email);

    if (!user) {
      throw new HttpException(
        'Email này không tồn tại. Vui lòng kiểm tra lại email.',
        HttpStatus.NOT_FOUND,
      );
    }

    // Kiểm tra user đã có password chưa (đã đăng ký đầy đủ)
    if (!user.password || user.password === '' || user.password === 'access_token' || user.password === 'refresh_token') {
      throw new HttpException(
        'Tài khoản này chưa được đăng ký đầy đủ. Vui lòng đăng ký tài khoản trước.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Tạo mã OTP 6 chữ số
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // OTP có hiệu lực trong 10 phút
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    // Lưu OTP vào database với type 'reset-password'
    await this.otpRepository.createOtp(email, otp, expiresAt, 'reset-password');

    // Gửi email OTP reset password
    await this.emailService.sendResetPasswordEmail(email, otp);

    return {
      message: 'Mã OTP đã được gửi đến email của bạn. Vui lòng kiểm tra email.',
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { email, otp, newPassword } = resetPasswordDto;

    // Kiểm tra email có tồn tại không
    const user = await this.authRepository.findByUserName(email);

    if (!user) {
      throw new HttpException(
        'Email này không tồn tại. Vui lòng kiểm tra lại email.',
        HttpStatus.NOT_FOUND,
      );
    }

    // Kiểm tra OTP hợp lệ (type: 'reset-password')
    const validOtp = await this.otpRepository.findValidOtp(email, otp, 'reset-password');

    if (!validOtp) {
      throw new HttpException(
        'Mã OTP không hợp lệ hoặc đã hết hạn. Vui lòng thử lại.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Hash password mới
    const hashedPassword = await this.haspassword(newPassword);

    // Cập nhật password mới
    await this.authRepository.updateUser(email, {
      password: hashedPassword,
    });

    // Đánh dấu OTP đã sử dụng
    await this.otpRepository.markOtpAsUsed(email, otp);

    return {
      message: 'Đặt lại mật khẩu thành công. Vui lòng đăng nhập với mật khẩu mới.',
    };
  }
=======
>>>>>>> origin/back-up
}
