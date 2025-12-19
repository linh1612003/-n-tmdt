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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
const login_dto_1 = require("../dto/login.dto");
const auth_repository_1 = require("../repository/auth.repository");
const otp_repository_1 = require("../repository/otp.repository");
const email_service_1 = require("./email.service");
require('dotenv').config();
let AuthService = class AuthService {
    constructor(authRepository, otpRepository, emailService, jwtService) {
        this.authRepository = authRepository;
        this.otpRepository = otpRepository;
        this.emailService = emailService;
        this.jwtService = jwtService;
    }
    async loginWithGoogle(profile_google) {
        const displayName = profile_google.displayName;
        const username = profile_google.id;
        const avaUrl = profile_google.photos[0].value;
        let user = await this.authRepository.findUserByGoogleType(username);
        if (!user) {
            user = await this.authRepository.createUserByGoogleType(username, displayName, avaUrl);
        }
        const token = await this.genarateToken(user.username, user._id.toString());
        return {
            access_token: token.accessToken,
            refresh_token: token.refreshToken,
            userId: user._id.toString(),
            role: user.role,
        };
    }
    async loginWithFacebook(profile_facebook) {
        const displayName = profile_facebook._json.last_name +
            ' ' +
            profile_facebook._json.first_name;
        const username = profile_facebook._json.id;
        let user = await this.authRepository.findUserByFacebookType(username);
        if (!user) {
            user = await this.authRepository.createUserByFacebookType(username, displayName);
        }
        const token = await this.genarateToken(user.username, user._id.toString());
        return {
            access_token: token.accessToken,
            refresh_token: token.refreshToken,
            userId: user._id.toString(),
            role: user.role,
        };
    }
    async register(registerUserDto) {
        const user = await this.authRepository.findByUserName(registerUserDto.username);
        if (user) {
            throw new common_1.HttpException('Username already exists', common_1.HttpStatus.CONFLICT);
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
    async login(loginUserDto, res) {
        const user = await this.authRepository.findByUserName(loginUserDto.username);
        if (!user) {
            throw new common_1.HttpException('User name is not exist', common_1.HttpStatus.UNAUTHORIZED);
        }
        const isMatch = await bcrypt.compare(loginUserDto.password, user.password);
        if (!isMatch) {
            throw new common_1.HttpException('Password is not correct', common_1.HttpStatus.UNAUTHORIZED);
        }
        const token = await this.genarateToken(user.username, user._id.toString());
        res.cookie('refreshToken', token.refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
        });
        return res.status(common_1.HttpStatus.OK).json({
            access_token: token.accessToken,
            refresh_token: token.refreshToken,
            userId: user._id.toString(),
            role: user.role,
        });
    }
    async refreshToken(refreshToken) {
        try {
            const verify = await this.jwtService.verifyAsync(refreshToken, {
                secret: process.env.REFRESH_TOKEN_SECRET,
            });
            return this.genarateToken(verify.username, verify.userId);
        }
        catch (err) {
            throw new common_1.HttpException(err.message + ' -- Refresh token is not valid', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async genarateToken(username, userId) {
        const accessToken = await this.jwtService.signAsync({ userId }, {
            secret: process.env.ACCESS_TOKEN_SECRET,
            expiresIn: '8h',
        });
        const refreshToken = await this.jwtService.signAsync({ userId }, {
            secret: process.env.REFRESH_TOKEN_SECRET,
            expiresIn: '7d',
        });
        await this.authRepository.findUserAndUpdateToken(username, accessToken, refreshToken);
        return {
            accessToken,
            refreshToken,
        };
    }
    async getUserById(userId) {
        const user = await this.authRepository.findById(userId);
        return this.getExistingUser(user, userId);
    }
    getExistingUser(user, userId) {
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
    async haspassword(password) {
        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    }
    async checkEmailAndSendOtp(email) {
        const normalizedEmail = email.trim().toLowerCase();
        console.log('[checkEmailAndSendOtp] Input email:', email);
        console.log('[checkEmailAndSendOtp] Normalized email:', normalizedEmail);
        let existingUser = await this.authRepository.findByUserName(normalizedEmail);
        if (!existingUser) {
            existingUser = await this.authRepository.findByUserName(email.trim());
        }
        const allUsersWithEmail = await this.authRepository.findAllUsersContainingEmail(normalizedEmail);
        console.log('[checkEmailAndSendOtp] All users containing email:', allUsersWithEmail.length);
        if (allUsersWithEmail.length > 0) {
            console.log('[checkEmailAndSendOtp] Sample usernames:', allUsersWithEmail.slice(0, 3).map(u => u.username));
        }
        console.log('[checkEmailAndSendOtp] Found user:', existingUser ? 'YES' : 'NO');
        if (existingUser) {
            console.log('[checkEmailAndSendOtp] User username in DB:', existingUser.username);
        }
        if (!existingUser) {
            console.log('[checkEmailAndSendOtp] Email chưa tồn tại, tạo user mới với email:', normalizedEmail);
            existingUser = await this.authRepository.createUser({
                type: 'LOCAL',
                username: normalizedEmail,
                password: '',
                displayName: '',
            });
            console.log('[checkEmailAndSendOtp] Đã tạo user mới với ID:', existingUser._id);
        }
        if (existingUser.password && existingUser.password !== '' && existingUser.password !== 'access_token' && existingUser.password !== 'refresh_token') {
            throw new common_1.HttpException('Email này đã được đăng ký. Vui lòng đăng nhập.', common_1.HttpStatus.CONFLICT);
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 10);
        await this.otpRepository.createOtp(normalizedEmail, otp, expiresAt, 'register');
        await this.emailService.sendOtpEmail(email.trim(), otp);
        return {
            message: 'Mã OTP đã được gửi đến email của bạn. Vui lòng kiểm tra email.',
        };
    }
    async verifyOtpAndRegister(verifyOtpDto) {
        const { email, otp, username, displayName, password } = verifyOtpDto;
        const normalizedEmail = email.trim().toLowerCase();
        const normalizedUsername = username.trim().toLowerCase();
        if (normalizedEmail !== normalizedUsername) {
            throw new common_1.HttpException('Email không khớp với username', common_1.HttpStatus.BAD_REQUEST);
        }
        const existingUser = await this.authRepository.findByUserName(normalizedUsername);
        if (!existingUser) {
            throw new common_1.HttpException('Email này không tồn tại. Vui lòng kiểm tra lại email.', common_1.HttpStatus.NOT_FOUND);
        }
        if (existingUser.password && existingUser.password !== '') {
            throw new common_1.HttpException('Email này đã được đăng ký. Vui lòng đăng nhập.', common_1.HttpStatus.CONFLICT);
        }
        const validOtp = await this.otpRepository.findValidOtp(normalizedEmail, otp, 'register');
        if (!validOtp) {
            throw new common_1.HttpException('Mã OTP không hợp lệ hoặc đã hết hạn. Vui lòng thử lại.', common_1.HttpStatus.BAD_REQUEST);
        }
        const hashedPassword = await this.haspassword(password);
        await this.authRepository.updateUser(normalizedUsername, {
            displayName,
            password: hashedPassword,
        });
        await this.otpRepository.markOtpAsUsed(normalizedEmail, otp);
        const updatedUser = await this.authRepository.findByUserName(normalizedUsername);
        return {
            message: 'Đăng ký thành công',
            userId: updatedUser._id.toString(),
        };
    }
    async requestPasswordReset(forgotPasswordDto) {
        const { email } = forgotPasswordDto;
        const user = await this.authRepository.findByUserName(email);
        if (!user) {
            throw new common_1.HttpException('Email này không tồn tại. Vui lòng kiểm tra lại email.', common_1.HttpStatus.NOT_FOUND);
        }
        if (!user.password || user.password === '' || user.password === 'access_token' || user.password === 'refresh_token') {
            throw new common_1.HttpException('Tài khoản này chưa được đăng ký đầy đủ. Vui lòng đăng ký tài khoản trước.', common_1.HttpStatus.BAD_REQUEST);
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 10);
        await this.otpRepository.createOtp(email, otp, expiresAt, 'reset-password');
        await this.emailService.sendResetPasswordEmail(email, otp);
        return {
            message: 'Mã OTP đã được gửi đến email của bạn. Vui lòng kiểm tra email.',
        };
    }
    async resetPassword(resetPasswordDto) {
        const { email, otp, newPassword } = resetPasswordDto;
        const user = await this.authRepository.findByUserName(email);
        if (!user) {
            throw new common_1.HttpException('Email này không tồn tại. Vui lòng kiểm tra lại email.', common_1.HttpStatus.NOT_FOUND);
        }
        const validOtp = await this.otpRepository.findValidOtp(email, otp, 'reset-password');
        if (!validOtp) {
            throw new common_1.HttpException('Mã OTP không hợp lệ hoặc đã hết hạn. Vui lòng thử lại.', common_1.HttpStatus.BAD_REQUEST);
        }
        const hashedPassword = await this.haspassword(newPassword);
        await this.authRepository.updateUser(email, {
            password: hashedPassword,
        });
        await this.otpRepository.markOtpAsUsed(email, otp);
        return {
            message: 'Đặt lại mật khẩu thành công. Vui lòng đăng nhập với mật khẩu mới.',
        };
    }
};
exports.AuthService = AuthService;
__decorate([
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginUserDto, Object]),
    __metadata("design:returntype", Promise)
], AuthService.prototype, "login", null);
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_repository_1.AuthRepository,
        otp_repository_1.OtpRepository,
        email_service_1.EmailService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map