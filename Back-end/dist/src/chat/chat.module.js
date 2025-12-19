"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const chat_controller_1 = require("./chat.controller");
const chat_service_1 = require("./services/chat.service");
const chat_repository_1 = require("./repository/chat.repository");
const chat_gateway_1 = require("./chat.gateway");
const message_schema_1 = require("./schema/message.schema");
const user_schema_1 = require("../auth/schemas/user.schema");
const logging_middleware_1 = require("../middlewares/logging.middleware");
const chatbot_intent_detector_1 = require("./services/chatbot.intent-detector");
const chatbot_context_manager_1 = require("./services/chatbot.context-manager");
const chatbot_service_1 = require("./services/chatbot.service");
const product_module_1 = require("../product/product.module");
const order_module_1 = require("../order/order.module");
const user_module_1 = require("../user/user.module");
let ChatModule = class ChatModule {
    configure(consumer) {
        consumer
            .apply(logging_middleware_1.VerifyTokenMiddleware)
            .forRoutes(chat_controller_1.ChatController);
    }
};
exports.ChatModule = ChatModule;
exports.ChatModule = ChatModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: message_schema_1.Message.name, schema: message_schema_1.MessageSchema },
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
            ]),
            (0, common_1.forwardRef)(() => product_module_1.ProductModule),
            (0, common_1.forwardRef)(() => order_module_1.OrderModule),
            user_module_1.UserModule,
        ],
        controllers: [chat_controller_1.ChatController],
        providers: [
            chat_service_1.ChatService,
            chat_repository_1.ChatRepository,
            chat_gateway_1.ChatGateway,
            logging_middleware_1.VerifyTokenMiddleware,
            chatbot_intent_detector_1.IntentDetector,
            chatbot_context_manager_1.ContextManager,
            chatbot_service_1.ChatbotService,
        ],
        exports: [chat_service_1.ChatService],
    })
], ChatModule);
//# sourceMappingURL=chat.module.js.map