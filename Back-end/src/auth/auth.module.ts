import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';

import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { GoogleStrategy } from './utils/GoogleStrategy';
import { FacebookStrategy } from './utils/FaceBookStrategy';
import { User, UserSchema } from './schemas/user.schema';
import { Otp, OtpSchema } from './schemas/otp.schema';
import { AuthService } from './services/auth.service';
import { EmailService } from './services/email.service';
import { AuthRepository } from './repository/auth.repository';
import { OtpRepository } from './repository/otp.repository';
import { VerifyTokenMiddleware } from 'src/middlewares/logging.middleware';
import { JwtStrategy } from './strategies/jwt.strategy';
require('dotenv').config();

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Otp.name, schema: OtpSchema },
    ]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [
    AuthService,
    EmailService,
    GoogleStrategy,
    FacebookStrategy,
    AuthRepository,
    OtpRepository,
    JwtStrategy,
  ],
  controllers: [AuthController],
  exports: [AuthRepository],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(VerifyTokenMiddleware)
      .forRoutes({ path: 'auth/logout', method: RequestMethod.POST });
  }
}
