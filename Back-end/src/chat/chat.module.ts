import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatController } from './chat.controller';
import { ChatService } from './services/chat.service';
import { ChatRepository } from './repository/chat.repository';
import { ChatGateway } from './chat.gateway';
import { Message, MessageSchema } from './schema/message.schema';
import { User, UserSchema } from '../auth/schemas/user.schema';
import { VerifyTokenMiddleware } from '../middlewares/logging.middleware';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Message.name, schema: MessageSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [ChatController],
  providers: [ChatService, ChatRepository, ChatGateway, VerifyTokenMiddleware],
  exports: [ChatService],
})
export class ChatModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(VerifyTokenMiddleware)
      .forRoutes(ChatController);
  }
}

