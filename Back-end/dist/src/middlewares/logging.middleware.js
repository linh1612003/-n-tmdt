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
exports.VerifyTokenMiddleware = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
let VerifyTokenMiddleware = class VerifyTokenMiddleware {
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    async use(req, res, next) {
        const authHeader = req.headers.authorization;
        console.log('VerifyTokenMiddleware - authHeader:', authHeader ? 'Present' : 'Missing');
        if (!authHeader) {
            console.log('VerifyTokenMiddleware - No authorization header');
            throw new common_1.UnauthorizedException('Bạn cần phải đăng nhập để thực hiện hành động này!');
        }
        const token = authHeader.split(' ')[1];
        console.log('VerifyTokenMiddleware - token:', token ? `Present (length: ${token.length})` : 'Missing');
        console.log('VerifyTokenMiddleware - token preview:', token ? `${token.substring(0, 20)}...` : 'N/A');
        console.log('VerifyTokenMiddleware - ACCESS_TOKEN_SECRET:', process.env.ACCESS_TOKEN_SECRET ? 'Set' : 'Not set');
        console.log('VerifyTokenMiddleware - JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Not set');
        if (!token) {
            console.error('VerifyTokenMiddleware - Token is missing from authorization header');
            throw new common_1.UnauthorizedException('Token is missing');
        }
        try {
            const secret = process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET;
            if (!secret) {
                console.error('VerifyTokenMiddleware - No secret found in environment variables');
                throw new common_1.UnauthorizedException('Server configuration error');
            }
            console.log('VerifyTokenMiddleware - Attempting to verify token with secret...');
            const verify = await this.jwtService.verifyAsync(token, {
                secret: secret,
            });
            console.log('VerifyTokenMiddleware - Token verified successfully');
            console.log('VerifyTokenMiddleware - Decoded token:', JSON.stringify(verify, null, 2));
            req.user = verify;
            next();
        }
        catch (error) {
            console.error('VerifyTokenMiddleware - Token verification failed');
            console.error('VerifyTokenMiddleware - Error name:', error.name);
            console.error('VerifyTokenMiddleware - Error message:', error.message);
            if (error.name === 'TokenExpiredError') {
                console.error('VerifyTokenMiddleware - Token has expired');
                throw new common_1.UnauthorizedException('Token đã hết hạn. Vui lòng đăng nhập lại.');
            }
            else if (error.name === 'JsonWebTokenError') {
                console.error('VerifyTokenMiddleware - Invalid token format or signature');
                throw new common_1.UnauthorizedException('Token không hợp lệ. Vui lòng đăng nhập lại.');
            }
            else {
                console.error('VerifyTokenMiddleware - Unknown error:', error);
                throw new common_1.UnauthorizedException('Invalid token');
            }
        }
    }
};
exports.VerifyTokenMiddleware = VerifyTokenMiddleware;
exports.VerifyTokenMiddleware = VerifyTokenMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], VerifyTokenMiddleware);
//# sourceMappingURL=logging.middleware.js.map