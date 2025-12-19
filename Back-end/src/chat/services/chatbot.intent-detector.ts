import { Injectable } from '@nestjs/common';

export enum IntentType {
  ORDER_STATUS = 'ORDER_STATUS',
  ORDER_TRACKING = 'ORDER_TRACKING',
  ORDER_CANCEL = 'ORDER_CANCEL',
  ORDER_CHANGE = 'ORDER_CHANGE',
  PRODUCT_SEARCH = 'PRODUCT_SEARCH',
  PRODUCT_PRICE = 'PRODUCT_PRICE',
  PRODUCT_STOCK = 'PRODUCT_STOCK',
  PRODUCT_SIZE = 'PRODUCT_SIZE',
  PRODUCT_COLOR = 'PRODUCT_COLOR',
  PRODUCT_COMPARE = 'PRODUCT_COMPARE',
  POLICY_RETURN = 'POLICY_RETURN',
  POLICY_WARRANTY = 'POLICY_WARRANTY',
  POLICY_SHIPPING = 'POLICY_SHIPPING',
  POLICY_PAYMENT = 'POLICY_PAYMENT',
  SUPPORT_HOURS = 'SUPPORT_HOURS',
  SUPPORT_ADDRESS = 'SUPPORT_ADDRESS',
  SUPPORT_CONTACT = 'SUPPORT_CONTACT',
  HANDOFF_REQUEST = 'HANDOFF_REQUEST',
  GREETING = 'GREETING',
  UNKNOWN = 'UNKNOWN',
}

export interface IntentResult {
  intent: IntentType;
  confidence: number;
  entities?: {
    orderId?: string;
    productId?: string;
    productName?: string;
  };
}

@Injectable()
export class IntentDetector {
  // Keywords cho từng intent
  private readonly intentPatterns: Map<IntentType, string[]> = new Map([
    // Đơn hàng
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
    // Sản phẩm
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
    // Chính sách
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
    // Hỗ trợ
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
    // Handoff
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
    // Greeting
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

  detectIntent(message: string, context?: any): IntentResult {
    const normalizedMessage = this.normalizeText(message);
    const originalMessage = message; // Giữ message gốc (có dấu)
    let bestMatch: IntentResult = {
      intent: IntentType.UNKNOWN,
      confidence: 0,
    };

    // Kiểm tra từng intent
    for (const [intent, keywords] of this.intentPatterns.entries()) {
      const confidence = this.calculateConfidence(normalizedMessage, keywords);
      if (confidence > bestMatch.confidence) {
        bestMatch = {
          intent,
          confidence,
          entities: this.extractEntities(originalMessage, intent, context), // Dùng message gốc
        };
      }
    }

    // Nếu có context, ưu tiên intent từ context
    if (context?.lastIntent && context.lastIntent !== IntentType.UNKNOWN) {
      const contextConfidence = this.calculateContextConfidence(
        normalizedMessage,
        context.lastIntent,
      );
      if (contextConfidence > 0.3) {
        bestMatch = {
          intent: context.lastIntent,
          confidence: Math.max(bestMatch.confidence, contextConfidence),
          entities: this.extractEntities(originalMessage, context.lastIntent, context), // Dùng message gốc
        };
      }
    }

    // Đặc biệt xử lý các câu ngắn gọn như "sản phẩm", "nhẫn", v.v.
    // Nếu message ngắn và match keyword chính xác, tăng confidence
    if (normalizedMessage.length < 20) {
      const exactMatches: Record<string, IntentType> = {
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
            confidence: 0.8, // High confidence for exact matches
            entities: this.extractEntities(normalizedMessage, intent, context),
          };
          break;
        }
      }
    }

    // Nếu confidence quá thấp, trả về UNKNOWN (nhưng giảm threshold xuống 0.2)
    if (bestMatch.confidence < 0.2) {
      bestMatch.intent = IntentType.UNKNOWN;
    }

    return bestMatch;
  }

  private normalizeText(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .trim();
  }

  private calculateConfidence(message: string, keywords: string[]): number {
    let matches = 0;
    let exactMatches = 0;
    
    for (const keyword of keywords) {
      if (message.includes(keyword)) {
        matches++;
        // Nếu keyword match chính xác (không phải substring), tăng điểm
        const words = message.split(/\s+/);
        if (words.includes(keyword) || message === keyword) {
          exactMatches++;
        }
      }
    }
    
    // Base confidence từ số matches
    const baseConfidence = matches / keywords.length;
    
    // Bonus cho exact matches (câu ngắn gọn)
    const exactBonus = exactMatches > 0 ? 0.3 : 0;
    
    // Nếu match nhiều keywords, confidence cao hơn
    const matchBonus = matches > 1 ? Math.min(0.2, matches * 0.1) : 0;
    
    return Math.min(1.0, baseConfidence + exactBonus + matchBonus);
  }

  private calculateContextConfidence(
    message: string,
    lastIntent: IntentType,
  ): number {
    // Nếu message ngắn và có vẻ là câu hỏi tiếp theo
    const shortQuestionKeywords = ['đâu', 'sao', 'thế nào', 'ra sao', 'bao giờ', 'khi nào'];
    const hasShortQuestion = shortQuestionKeywords.some(kw => message.includes(kw));
    
    if (hasShortQuestion && message.length < 20) {
      return 0.7; // High confidence for follow-up questions
    }
    return 0.3;
  }

  private extractEntities(
    message: string,
    intent: IntentType,
    context?: any,
  ): IntentResult['entities'] {
    const entities: IntentResult['entities'] = {};
    const originalMessage = message; // Giữ message gốc (có dấu)

    // Extract order ID (pattern: số hoặc mã đơn hàng)
    const orderIdMatch = message.match(/(?:đơn|order|mã)\s*[#:]?\s*([a-z0-9]+)/i);
    if (orderIdMatch) {
      entities.orderId = orderIdMatch[1];
    } else if (context?.lastOrderId) {
      entities.orderId = context.lastOrderId;
    }

    // Extract product name - GIỮ NGUYÊN DẤU TIẾNG VIỆT
    const productKeywords = [
      'sản phẩm', 'product', 'món', 'item',
      'muốn mua', 'mua', 'tìm', 'xem',
      'nhẫn', 'vòng', 'dây chuyền', 'bông tai', 'lắc tay', 'vòng cổ', 'trang sức'
    ];
    
    // Pattern 1: "muốn mua [sản phẩm]" hoặc "mua [sản phẩm]"
    const buyPattern = originalMessage.match(/(?:muốn\s+)?mua\s+(.+?)(?:\s|$)/i);
    if (buyPattern) {
      entities.productName = buyPattern[1].trim();
    }
    
    // Pattern 2: "tìm [sản phẩm]" hoặc "xem [sản phẩm]"
    const searchPattern = originalMessage.match(/(?:tìm|xem)\s+(.+?)(?:\s|$)/i);
    if (searchPattern && !entities.productName) {
      entities.productName = searchPattern[1].trim();
    }
    
    // Pattern 3: Tìm từ khóa sản phẩm trực tiếp (nhẫn, vòng, v.v.) - GIỮ NGUYÊN DẤU
    const directProductKeywords = ['nhẫn', 'vòng', 'dây chuyền', 'bông tai', 'lắc tay', 'vòng cổ'];
    for (const keyword of directProductKeywords) {
      // Tìm trong message gốc (có dấu)
      if (originalMessage.toLowerCase().includes(keyword) && !entities.productName) {
        entities.productName = keyword;
        break;
      }
    }
    
    // Pattern 4: "sản phẩm [tên]"
    const productPattern = originalMessage.match(/(?:sản phẩm|product|món)\s+(.+?)(?:\s|$)/i);
    if (productPattern && !entities.productName) {
      entities.productName = productPattern[1].trim();
    }

    return Object.keys(entities).length > 0 ? entities : undefined;
  }
}

