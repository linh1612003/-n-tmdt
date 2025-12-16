import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class VerifyTokenMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) { }

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    console.log('VerifyTokenMiddleware - authHeader:', authHeader ? 'Present' : 'Missing');

    if (!authHeader) {
      console.log('VerifyTokenMiddleware - No authorization header');
      throw new UnauthorizedException(
        'Bạn cần phải đăng nhập để thực hiện hành động này!',
      );
    }

    const token = authHeader.split(' ')[1];
    console.log('VerifyTokenMiddleware - token:', token ? `Present (length: ${token.length})` : 'Missing');
    console.log('VerifyTokenMiddleware - token preview:', token ? `${token.substring(0, 20)}...` : 'N/A');
    console.log('VerifyTokenMiddleware - ACCESS_TOKEN_SECRET:', process.env.ACCESS_TOKEN_SECRET ? 'Set' : 'Not set');
    console.log('VerifyTokenMiddleware - JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Not set');

    if (!token) {
      console.error('VerifyTokenMiddleware - Token is missing from authorization header');
      throw new UnauthorizedException('Token is missing');
    }

    try {
      // Thử với ACCESS_TOKEN_SECRET trước, nếu không có thì dùng JWT_SECRET
      const secret = process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET;
      if (!secret) {
        console.error('VerifyTokenMiddleware - No secret found in environment variables');
        throw new UnauthorizedException('Server configuration error');
      }

      console.log('VerifyTokenMiddleware - Attempting to verify token with secret...');
      const verify = await this.jwtService.verifyAsync(token, {
        secret: secret,
      });
      console.log('VerifyTokenMiddleware - Token verified successfully');
      console.log('VerifyTokenMiddleware - Decoded token:', JSON.stringify(verify, null, 2));
      req.user = verify;
      next();
    } catch (error) {
      console.error('VerifyTokenMiddleware - Token verification failed');
      console.error('VerifyTokenMiddleware - Error name:', error.name);
      console.error('VerifyTokenMiddleware - Error message:', error.message);
      if (error.name === 'TokenExpiredError') {
        console.error('VerifyTokenMiddleware - Token has expired');
        throw new UnauthorizedException('Token đã hết hạn. Vui lòng đăng nhập lại.');
      } else if (error.name === 'JsonWebTokenError') {
        console.error('VerifyTokenMiddleware - Invalid token format or signature');
        throw new UnauthorizedException('Token không hợp lệ. Vui lòng đăng nhập lại.');
      } else {
        console.error('VerifyTokenMiddleware - Unknown error:', error);
        throw new UnauthorizedException('Invalid token');
      }
    }
  }
}
