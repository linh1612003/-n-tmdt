import { IntentType } from './chatbot.intent-detector';
export interface ConversationContext {
    userId: string;
    lastIntent?: IntentType;
    lastOrderId?: string;
    lastProductId?: string;
    conversationHistory: Array<{
        message: string;
        intent?: IntentType;
        timestamp: Date;
    }>;
    handoffRequested: boolean;
    unknownCount: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare class ContextManager {
    private contexts;
    private readonly MAX_HISTORY;
    private readonly MAX_UNKNOWN_BEFORE_HANDOFF;
    getContext(userId: string): ConversationContext;
    updateContext(userId: string, message: string, intent?: IntentType): ConversationContext;
    shouldHandoff(context: ConversationContext): boolean;
    requestHandoff(userId: string): void;
    clearContext(userId: string): void;
    getUserPersonalization(context: ConversationContext): {
        hasOrderHistory: boolean;
        lastOrderId?: string;
        lastProductId?: string;
    };
}
