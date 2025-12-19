import { IntentDetector, IntentType } from './chatbot.intent-detector';
import { ContextManager } from './chatbot.context-manager';
import { ProductService } from '../../product/service/product.service';
import { OrderService } from '../../order/service/order.service';
import { UserService } from '../../user/services/user.service';
import { Model } from 'mongoose';
import { User } from '../../auth/schemas/user.schema';
export interface ChatbotResponse {
    content: string;
    quickReplies?: Array<{
        title: string;
        payload: string;
    }>;
    metadata?: {
        intent: IntentType;
        orderId?: string;
        productId?: string;
        productUrl?: string;
        productLinks?: Array<{
            productId: string;
            url: string;
            name: string;
        }>;
        handoffRequested?: boolean;
    };
}
export declare class ChatbotService {
    private readonly intentDetector;
    private readonly contextManager;
    private readonly productService;
    private readonly orderService;
    private readonly userService;
    private readonly userModel;
    private readonly BOT_USER_ID;
    constructor(intentDetector: IntentDetector, contextManager: ContextManager, productService: ProductService, orderService: OrderService, userService: UserService, userModel: Model<User>);
    processMessage(userId: string, message: string): Promise<ChatbotResponse | null>;
    private handleIntent;
    private handleGreeting;
    private handleOrderStatus;
    private handleOrderTracking;
    private handleOrderModification;
    private handleProductSearch;
    private handleProductPrice;
    private handleProductStock;
    private handleProductDetails;
    private handleProductCompare;
    private handlePolicyReturn;
    private handlePolicyWarranty;
    private handlePolicyShipping;
    private handlePolicyPayment;
    private handleSupportHours;
    private handleSupportAddress;
    private handleSupportContact;
    private handleUnknown;
    private handleHandoff;
    getBotUserId(): string;
    private normalizeText;
}
