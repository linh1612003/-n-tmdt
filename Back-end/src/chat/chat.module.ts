import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
  forwardRef,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatController } from './chat.controller';
import { ChatService } from './services/chat.service';
import { ChatRepository } from './repository/chat.repository';
import { ChatGateway } from './chat.gateway';
import { Message, MessageSchema } from './schema/message.schema';
import { User, UserSchema } from '../auth/schemas/user.schema';
import { VerifyTokenMiddleware } from '../middlewares/logging.middleware';
import { IntentDetector } from './services/chatbot.intent-detector';
import { ContextManager } from './services/chatbot.context-manager';
import { ChatbotService } from './services/chatbot.service';
import { ProductModule } from '../product/product.module';
import { OrderModule } from '../order/order.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Message.name, schema: MessageSchema },
      { name: User.name, schema: UserSchema },
    ]),
    forwardRef(() => ProductModule),
    forwardRef(() => OrderModule),
    UserModule,
  ],
  controllers: [ChatController],
  providers: [
    ChatService,
    ChatRepository,
    ChatGateway,
    VerifyTokenMiddleware,
    IntentDetector,
    ContextManager,
    ChatbotService,
  ],
  exports: [ChatService],
})
export class ChatModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(VerifyTokenMiddleware)
      .forRoutes(ChatController);
  }
}

