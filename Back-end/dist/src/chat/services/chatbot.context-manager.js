"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextManager = void 0;
const common_1 = require("@nestjs/common");
const chatbot_intent_detector_1 = require("./chatbot.intent-detector");
let ContextManager = class ContextManager {
    constructor() {
        this.contexts = new Map();
        this.MAX_HISTORY = 10;
        this.MAX_UNKNOWN_BEFORE_HANDOFF = 3;
    }
    getContext(userId) {
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
        return this.contexts.get(userId);
    }
    updateContext(userId, message, intent) {
        const context = this.getContext(userId);
        context.conversationHistory.push({
            message,
            intent,
            timestamp: new Date(),
        });
        if (context.conversationHistory.length > this.MAX_HISTORY) {
            context.conversationHistory.shift();
        }
        if (intent) {
            context.lastIntent = intent;
            if (intent !== chatbot_intent_detector_1.IntentType.UNKNOWN) {
                context.unknownCount = 0;
            }
            else {
                context.unknownCount++;
            }
        }
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
    shouldHandoff(context) {
        if (context.handoffRequested) {
            return true;
        }
        if (context.unknownCount >= this.MAX_UNKNOWN_BEFORE_HANDOFF) {
            return true;
        }
        if (context.lastIntent === chatbot_intent_detector_1.IntentType.HANDOFF_REQUEST) {
            context.handoffRequested = true;
            return true;
        }
        return false;
    }
    requestHandoff(userId) {
        const context = this.getContext(userId);
        context.handoffRequested = true;
        context.updatedAt = new Date();
    }
    clearContext(userId) {
        this.contexts.delete(userId);
    }
    getUserPersonalization(context) {
        return {
            hasOrderHistory: !!context.lastOrderId,
            lastOrderId: context.lastOrderId,
            lastProductId: context.lastProductId,
        };
    }
};
exports.ContextManager = ContextManager;
exports.ContextManager = ContextManager = __decorate([
    (0, common_1.Injectable)()
], ContextManager);
//# sourceMappingURL=chatbot.context-manager.js.map