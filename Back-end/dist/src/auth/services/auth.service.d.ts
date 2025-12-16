import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from '../dto/register-user.dto';
import { LoginUserDto } from '../dto/login.dto';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { AuthRepository } from '../repository/auth.repository';
import { OtpRepository } from '../repository/otp.repository';
import { EmailService } from './email.service';
import { Response } from 'express';
import { User } from '../schemas/user.schema';
export declare class AuthService {
    private readonly authRepository;
    private readonly otpRepository;
    private readonly emailService;
    private jwtService;
    constructor(authRepository: AuthRepository, otpRepository: OtpRepository, emailService: EmailService, jwtService: JwtService);
    loginWithGoogle(profile_google: any): Promise<{
        access_token: string;
        refresh_token: string;
        userId: string;
        role: string;
    }>;
    loginWithFacebook(profile_facebook: any): Promise<{
        access_token: string;
        refresh_token: string;
        userId: string;
        role: string;
    }>;
    register(registerUserDto: RegisterUserDto): Promise<{
        message: string;
    }>;
    login(loginUserDto: LoginUserDto, res: Response): Promise<Response<any, Record<string, any>>>;
    refreshToken(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    private genarateToken;
    getUserById(userId: string): Promise<{
        userId: string;
        type: string;
        userName: string;
        displayName: string;
        avaUrl: string;
        facebookId: string;
        contactPhone: string;
        address: string;
        addressDetail: string;
    }>;
    getExistingUser(user: User, userId: string): {
        userId: string;
        type: string;
        userName: string;
        displayName: string;
        avaUrl: string;
        facebookId: string;
        contactPhone: string;
        address: string;
        addressDetail: string;
    };
    private haspassword;
    checkEmailAndSendOtp(email: string): Promise<{
        message: string;
    }>;
    verifyOtpAndRegister(verifyOtpDto: any): Promise<{
        message: string;
        userId: string;
    }>;
    requestPasswordReset(forgotPasswordDto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        message: string;
    }>;
}
