"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntentDetector = exports.IntentType = void 0;
const common_1 = require("@nestjs/common");
var IntentType;
(function (IntentType) {
    IntentType["ORDER_STATUS"] = "ORDER_STATUS";
    IntentType["ORDER_TRACKING"] = "ORDER_TRACKING";
    IntentType["ORDER_CANCEL"] = "ORDER_CANCEL";
    IntentType["ORDER_CHANGE"] = "ORDER_CHANGE";
    IntentType["PRODUCT_SEARCH"] = "PRODUCT_SEARCH";
    IntentType["PRODUCT_PRICE"] = "PRODUCT_PRICE";
    IntentType["PRODUCT_STOCK"] = "PRODUCT_STOCK";
    IntentType["PRODUCT_SIZE"] = "PRODUCT_SIZE";
    IntentType["PRODUCT_COLOR"] = "PRODUCT_COLOR";
    IntentType["PRODUCT_COMPARE"] = "PRODUCT_COMPARE";
    IntentType["POLICY_RETURN"] = "POLICY_RETURN";
    IntentType["POLICY_WARRANTY"] = "POLICY_WARRANTY";
    IntentType["POLICY_SHIPPING"] = "POLICY_SHIPPING";
    IntentType["POLICY_PAYMENT"] = "POLICY_PAYMENT";
    IntentType["SUPPORT_HOURS"] = "SUPPORT_HOURS";
    IntentType["SUPPORT_ADDRESS"] = "SUPPORT_ADDRESS";
    IntentType["SUPPORT_CONTACT"] = "SUPPORT_CONTACT";
    IntentType["HANDOFF_REQUEST"] = "HANDOFF_REQUEST";
    IntentType["GREETING"] = "GREETING";
    IntentType["UNKNOWN"] = "UNKNOWN";
})(IntentType || (exports.IntentType = IntentType = {}));
let IntentDetector = class IntentDetector {
    constructor() {
        this.intentPatterns = new Map([
            [
                IntentType.ORDER_STATUS,
                [
                    'trạng thái đơn hàng',
                    'đơn hàng của tôi',
                    'đơn hàng',
                    'đơn',
                    'tình trạng đơn',
                    'đơn hàng đâu',
                    'đơn hàng như thế nào',
                    'đơn hàng ra sao',
                ],
            ],
            [
                IntentType.ORDER_TRACKING,
                [
                    'mã vận đơn',
                    'tracking',
                    'theo dõi đơn hàng',
                    'đơn hàng đến đâu',
                    'giao hàng',
                    'vận chuyển',
                    'shipping',
                    'bao giờ giao',
                    'khi nào giao',
                    'thời gian giao',
                ],
            ],
            [
                IntentType.ORDER_CANCEL,
                [
                    'hủy đơn',
                    'hủy đơn hàng',
                    'cancel',
                    'xóa đơn',
                    'hủy',
                ],
            ],
            [
                IntentType.ORDER_CHANGE,
                [
                    'đổi đơn',
                    'thay đổi đơn hàng',
                    'sửa đơn',
                    'đổi',
                ],
            ],
            [
                IntentType.PRODUCT_SEARCH,
                [
                    'muốn mua',
                    'mua',
                    'tìm',
                    'tìm kiếm',
                    'xem sản phẩm',
                    'sản phẩm',
                    'nhẫn',
                    'vòng',
                    'dây chuyền',
                    'bông tai',
                    'lắc tay',
                    'vòng cổ',
                    'trang sức',
                    'jewelry',
                    'product',
                    'mua hàng',
                    'đặt hàng',
                    'có gì',
                    'show me',
                    'browse',
                ],
            ],
            [
                IntentType.PRODUCT_PRICE,
                [
                    'giá',
                    'giá bao nhiêu',
                    'bao nhiêu tiền',
                    'giá sản phẩm',
                    'price',
                    'cost',
                ],
            ],
            [
                IntentType.PRODUCT_STOCK,
                [
                    'còn hàng',
                    'tồn kho',
                    'có hàng',
                    'hết hàng',
                    'stock',
                    'inventory',
                    'còn không',
                ],
            ],
            [
                IntentType.PRODUCT_SIZE,
                [
                    'kích thước',
                    'size',
                    'cỡ',
                    'to nhỏ',
                ],
            ],
            [
                IntentType.PRODUCT_COLOR,
                [
                    'màu',
                    'màu sắc',
                    'color',
                    'có màu gì',
                ],
            ],
            [
                IntentType.PRODUCT_COMPARE,
                [
                    'so sánh',
                    'khác nhau',
                    'khác gì',
                    'compare',
                ],
            ],
            [
                IntentType.POLICY_RETURN,
                [
                    'đổi trả',
                    'trả hàng',
                    'đổi hàng',
                    'return',
                    'refund',
                    'hoàn tiền',
                ],
            ],
            [
                IntentType.POLICY_WARRANTY,
                [
                    'bảo hành',
                    'warranty',
                    'bảo hành như thế nào',
                ],
            ],
            [
                IntentType.POLICY_SHIPPING,
                [
                    'phí vận chuyển',
                    'phí ship',
                    'shipping fee',
                    'vận chuyển',
                    'giao hàng',
                ],
            ],
            [
                IntentType.POLICY_PAYMENT,
                [
                    'thanh toán',
                    'payment',
                    'hình thức thanh toán',
                    'cách thanh toán',
                    'trả tiền',
                ],
            ],
            [
                IntentType.SUPPORT_HOURS,
                [
                    'giờ làm việc',
                    'mở cửa',
                    'working hours',
                    'giờ',
                ],
            ],
            [
                IntentType.SUPPORT_ADDRESS,
                [
                    'địa chỉ',
                    'address',
                    'cửa hàng',
                    'shop',
                    'ở đâu',
                ],
            ],
            [
                IntentType.SUPPORT_CONTACT,
                [
                    'liên hệ',
                    'contact',
                    'hotline',
                    'số điện thoại',
                    'phone',
                ],
            ],
            [
                IntentType.HANDOFF_REQUEST,
                [
                    'gặp nhân viên',
                    'gặp admin',
                    'nhân viên',
                    'admin',
                    'tư vấn viên',
                    'người thật',
                    'human',
                    'khiếu nại',
                    'phàn nàn',
                    'complaint',
                ],
            ],
            [
                IntentType.GREETING,
                [
                    'xin chào',
                    'chào',
                    'hello',
                    'hi',
                    'hey',
                    'xin chào',
                ],
            ],
        ]);
    }
    detectIntent(message, context) {
        const normalizedMessage = this.normalizeText(message);
        const originalMessage = message;
        let bestMatch = {
            intent: IntentType.UNKNOWN,
            confidence: 0,
        };
        for (const [intent, keywords] of this.intentPatterns.entries()) {
            const confidence = this.calculateConfidence(normalizedMessage, keywords);
            if (confidence > bestMatch.confidence) {
                bestMatch = {
                    intent,
                    confidence,
                    entities: this.extractEntities(originalMessage, intent, context),
                };
            }
        }
        if (context?.lastIntent && context.lastIntent !== IntentType.UNKNOWN) {
            const contextConfidence = this.calculateContextConfidence(normalizedMessage, context.lastIntent);
            if (contextConfidence > 0.3) {
                bestMatch = {
                    intent: context.lastIntent,
                    confidence: Math.max(bestMatch.confidence, contextConfidence),
                    entities: this.extractEntities(originalMessage, context.lastIntent, context),
                };
            }
        }
        if (normalizedMessage.length < 20) {
            const exactMatches = {
                'sản phẩm': IntentType.PRODUCT_SEARCH,
                'xem sản phẩm': IntentType.PRODUCT_SEARCH,
                'nhẫn': IntentType.PRODUCT_SEARCH,
                'vòng': IntentType.PRODUCT_SEARCH,
                'dây chuyền': IntentType.PRODUCT_SEARCH,
                'bông tai': IntentType.PRODUCT_SEARCH,
                'lắc tay': IntentType.PRODUCT_SEARCH,
                'vòng cổ': IntentType.PRODUCT_SEARCH,
                'trang sức': IntentType.PRODUCT_SEARCH,
                'đơn hàng': IntentType.ORDER_STATUS,
                'kiểm tra đơn hàng': IntentType.ORDER_STATUS,
            };
            for (const [keyword, intent] of Object.entries(exactMatches)) {
                if (normalizedMessage.includes(keyword)) {
                    bestMatch = {
                        intent,
                        confidence: 0.8,
                        entities: this.extractEntities(normalizedMessage, intent, context),
                    };
                    break;
                }
            }
        }
        if (bestMatch.confidence < 0.2) {
            bestMatch.intent = IntentType.UNKNOWN;
        }
        return bestMatch;
    }
    normalizeText(text) {
        return text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .trim();
    }
    calculateConfidence(message, keywords) {
        let matches = 0;
        let exactMatches = 0;
        for (const keyword of keywords) {
            if (message.includes(keyword)) {
                matches++;
                const words = message.split(/\s+/);
                if (words.includes(keyword) || message === keyword) {
                    exactMatches++;
                }
            }
        }
        const baseConfidence = matches / keywords.length;
        const exactBonus = exactMatches > 0 ? 0.3 : 0;
        const matchBonus = matches > 1 ? Math.min(0.2, matches * 0.1) : 0;
        return Math.min(1.0, baseConfidence + exactBonus + matchBonus);
    }
    calculateContextConfidence(message, lastIntent) {
        const shortQuestionKeywords = ['đâu', 'sao', 'thế nào', 'ra sao', 'bao giờ', 'khi nào'];
        const hasShortQuestion = shortQuestionKeywords.some(kw => message.includes(kw));
        if (hasShortQuestion && message.length < 20) {
            return 0.7;
        }
        return 0.3;
    }
    extractEntities(message, intent, context) {
        const entities = {};
        const originalMessage = message;
        const orderIdMatch = message.match(/(?:đơn|order|mã)\s*[#:]?\s*([a-z0-9]+)/i);
        if (orderIdMatch) {
            entities.orderId = orderIdMatch[1];
        }
        else if (context?.lastOrderId) {
            entities.orderId = context.lastOrderId;
        }
        const productKeywords = [
            'sản phẩm', 'product', 'món', 'item',
            'muốn mua', 'mua', 'tìm', 'xem',
            'nhẫn', 'vòng', 'dây chuyền', 'bông tai', 'lắc tay', 'vòng cổ', 'trang sức'
        ];
        const buyPattern = originalMessage.match(/(?:muốn\s+)?mua\s+(.+?)(?:\s|$)/i);
        if (buyPattern) {
            entities.productName = buyPattern[1].trim();
        }
        const searchPattern = originalMessage.match(/(?:tìm|xem)\s+(.+?)(?:\s|$)/i);
        if (searchPattern && !entities.productName) {
            entities.productName = searchPattern[1].trim();
        }
        const directProductKeywords = ['nhẫn', 'vòng', 'dây chuyền', 'bông tai', 'lắc tay', 'vòng cổ'];
        for (const keyword of directProductKeywords) {
            if (originalMessage.toLowerCase().includes(keyword) && !entities.productName) {
                entities.productName = keyword;
                break;
            }
        }
        const productPattern = originalMessage.match(/(?:sản phẩm|product|món)\s+(.+?)(?:\s|$)/i);
        if (productPattern && !entities.productName) {
            entities.productName = productPattern[1].trim();
        }
        return Object.keys(entities).length > 0 ? entities : undefined;
    }
};
exports.IntentDetector = IntentDetector;
exports.IntentDetector = IntentDetector = __decorate([
    (0, common_1.Injectable)()
], IntentDetector);
//# sourceMappingURL=chatbot.intent-detector.js.map