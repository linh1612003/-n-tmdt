import { Injectable } from '@nestjs/common';
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
  unknownCount: number; // Số lần chatbot không hiểu
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class ContextManager {
  private contexts: Map<string, ConversationContext> = new Map();
  private readonly MAX_HISTORY = 10; // Giữ tối đa 10 tin nhắn trong lịch sử
  private readonly MAX_UNKNOWN_BEFORE_HANDOFF = 3; // Handoff sau 3 lần không hiểu

  getContext(userId: string): ConversationContext {
    if (!this.contexts.has(userId)) {
      this.contexts.set(userId, {
        userId,
        conversationHistory: [],
        handoffRequested: false,
        unknownCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    return this.contexts.get(userId)!;
  }

  updateContext(
    userId: string,
    message: string,
    intent?: IntentType,
  ): ConversationContext {
    const context = this.getContext(userId);
    
    // Thêm vào lịch sử
    context.conversationHistory.push({
      message,
      intent,
      timestamp: new Date(),
    });

    // Giữ chỉ MAX_HISTORY tin nhắn gần nhất
    if (context.conversationHistory.length > this.MAX_HISTORY) {
      context.conversationHistory.shift();
    }

    // Cập nhật intent và entities
    if (intent) {
      context.lastIntent = intent;
      
      // Reset unknown count nếu hiểu được
      if (intent !== IntentType.UNKNOWN) {
        context.unknownCount = 0;
      } else {
        context.unknownCount++;
      }
    }

    // Extract và lưu orderId, productId từ message nếu có
    const orderIdMatch = message.match(/(?:đơn|order|mã)\s*[#:]?\s*([a-z0-9]+)/i);
    if (orderIdMatch) {
      context.lastOrderId = orderIdMatch[1];
    }

    const productIdMatch = message.match(/(?:sản phẩm|product)\s*[#:]?\s*([a-z0-9]+)/i);
    if (productIdMatch) {
      context.lastProductId = productIdMatch[1];
    }

    context.updatedAt = new Date();

    return context;
  }

  shouldHandoff(context: ConversationContext): boolean {
    // Handoff nếu:
    // 1. User yêu cầu rõ ràng
    if (context.handoffRequested) {
      return true;
    }

    // 2. Không hiểu quá nhiều lần
    if (context.unknownCount >= this.MAX_UNKNOWN_BEFORE_HANDOFF) {
      return true;
    }

    // 3. Intent là HANDOFF_REQUEST
    if (context.lastIntent === IntentType.HANDOFF_REQUEST) {
      context.handoffRequested = true;
      return true;
    }

    return false;
  }

  requestHandoff(userId: string): void {
    const context = this.getContext(userId);
    context.handoffRequested = true;
    context.updatedAt = new Date();
  }

  clearContext(userId: string): void {
    this.contexts.delete(userId);
  }

  // Lấy thông tin user từ context để cá nhân hóa
  getUserPersonalization(context: ConversationContext): {
    hasOrderHistory: boolean;
    lastOrderId?: string;
    lastProductId?: string;
  } {
    return {
      hasOrderHistory: !!context.lastOrderId,
      lastOrderId: context.lastOrderId,
      lastProductId: context.lastProductId,
    };
  }
}

