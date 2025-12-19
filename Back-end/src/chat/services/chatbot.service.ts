import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { IntentDetector, IntentType, IntentResult } from './chatbot.intent-detector';
import { ContextManager, ConversationContext } from './chatbot.context-manager';
import { ProductService } from '../../product/service/product.service';
import { OrderService } from '../../order/service/order.service';
import { UserService } from '../../user/services/user.service';
import { InjectModel } from '@nestjs/mongoose';
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

@Injectable()
export class ChatbotService {
  private readonly BOT_USER_ID = 'chatbot-assistant'; // ID đặc biệt cho chatbot

  constructor(
    private readonly intentDetector: IntentDetector,
    private readonly contextManager: ContextManager,
    @Inject(forwardRef(() => ProductService))
    private readonly productService: ProductService,
    @Inject(forwardRef(() => OrderService))
    private readonly orderService: OrderService,
    private readonly userService: UserService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async processMessage(
    userId: string,
    message: string,
  ): Promise<ChatbotResponse | null> {
    // Lấy context
    const context = this.contextManager.getContext(userId);

    // Phát hiện intent
    const intentResult = this.intentDetector.detectIntent(message, {
      lastIntent: context.lastIntent,
      lastOrderId: context.lastOrderId,
      lastProductId: context.lastProductId,
    });

    console.log('ChatbotService: processMessage', {
      message,
      intent: intentResult.intent,
      confidence: intentResult.confidence,
      entities: intentResult.entities,
    });

    // Cập nhật context
    this.contextManager.updateContext(userId, message, intentResult.intent);

    // Kiểm tra handoff
    const updatedContext = this.contextManager.getContext(userId);
    if (this.contextManager.shouldHandoff(updatedContext)) {
      return this.handleHandoff(userId, updatedContext);
    }

    // Xử lý theo intent
    return this.handleIntent(userId, intentResult, updatedContext);
  }

  private async handleIntent(
    userId: string,
    intentResult: IntentResult,
    context: ConversationContext,
  ): Promise<ChatbotResponse> {
    const { intent, entities } = intentResult;
    const user = await this.userModel.findById(userId);
    const userName = user?.displayName || 'bạn';

    switch (intent) {
      case IntentType.GREETING:
        return this.handleGreeting(userName, context);

      case IntentType.ORDER_STATUS:
        return await this.handleOrderStatus(userId, entities, context);

      case IntentType.ORDER_TRACKING:
        return await this.handleOrderTracking(userId, entities, context);

      case IntentType.ORDER_CANCEL:
      case IntentType.ORDER_CHANGE:
        return this.handleOrderModification(intent);

      case IntentType.PRODUCT_SEARCH:
        return await this.handleProductSearch(entities, context);

      case IntentType.PRODUCT_PRICE:
        return await this.handleProductPrice(entities, context);

      case IntentType.PRODUCT_STOCK:
        return await this.handleProductStock(entities, context);

      case IntentType.PRODUCT_SIZE:
      case IntentType.PRODUCT_COLOR:
        return await this.handleProductDetails(intent, entities, context);

      case IntentType.PRODUCT_COMPARE:
        return this.handleProductCompare();

      case IntentType.POLICY_RETURN:
        return this.handlePolicyReturn();

      case IntentType.POLICY_WARRANTY:
        return this.handlePolicyWarranty();

      case IntentType.POLICY_SHIPPING:
        return this.handlePolicyShipping();

      case IntentType.POLICY_PAYMENT:
        return this.handlePolicyPayment();

      case IntentType.SUPPORT_HOURS:
        return this.handleSupportHours();

      case IntentType.SUPPORT_ADDRESS:
        return this.handleSupportAddress();

      case IntentType.SUPPORT_CONTACT:
        return this.handleSupportContact();

      case IntentType.UNKNOWN:
        return this.handleUnknown(context);

      default:
        return this.handleUnknown(context);
    }
  }

  private handleGreeting(userName: string, context: ConversationContext): ChatbotResponse {
    const greetings = [
      `Xin chào ${userName}! Em có thể giúp gì cho anh/chị ạ?`,
      `Chào ${userName}! Em sẵn sàng hỗ trợ anh/chị!`,
      `Xin chào! Em là chatbot hỗ trợ, em có thể giúp gì cho anh/chị?`,
    ];

    return {
      content: greetings[Math.floor(Math.random() * greetings.length)],
      quickReplies: [
        { title: 'Kiểm tra đơn hàng', payload: 'CHECK_ORDER' },
        { title: 'Xem sản phẩm', payload: 'VIEW_PRODUCTS' },
        { title: 'Chính sách đổi trả', payload: 'RETURN_POLICY' },
        { title: 'Gặp nhân viên', payload: 'HANDOFF' },
      ],
      metadata: { intent: IntentType.GREETING },
    };
  }

  private async handleOrderStatus(
    userId: string,
    entities: IntentResult['entities'],
    context: ConversationContext,
  ): Promise<ChatbotResponse> {
    try {
      const orders = await this.orderService.getOrderUser(userId);
      
      if (!orders || orders.length === 0) {
        return {
          content: 'Em không tìm thấy đơn hàng nào của anh/chị. Anh/chị có muốn đặt hàng không ạ?',
          quickReplies: [
            { title: 'Xem sản phẩm', payload: 'VIEW_PRODUCTS' },
            { title: 'Gặp nhân viên', payload: 'HANDOFF' },
          ],
          metadata: { intent: IntentType.ORDER_STATUS },
        };
      }

      // Nếu có orderId cụ thể, tìm đơn đó
      if (entities?.orderId) {
        const order = orders.find(o => 
          o._id.toString().includes(entities.orderId!) || 
          o._id.toString().toLowerCase() === entities.orderId!.toLowerCase()
        );
        
        if (order) {
          return {
            content: `Đơn hàng #${order._id.toString().slice(-6)} của anh/chị đang ở trạng thái: ${order.status || 'Đang xử lý'}. ${order.shippingStatus ? `Vận chuyển: ${order.shippingStatus}` : ''}`,
            metadata: { 
              intent: IntentType.ORDER_STATUS,
              orderId: order._id.toString(),
            },
          };
        }
      }

      // Hiển thị đơn hàng gần nhất
      const latestOrder = orders[orders.length - 1];
      const orderCount = orders.length;

      return {
        content: `Anh/chị có ${orderCount} đơn hàng. Đơn hàng gần nhất #${latestOrder._id.toString().slice(-6)} đang ở trạng thái: ${latestOrder.status || 'Đang xử lý'}. ${latestOrder.shippingStatus ? `Vận chuyển: ${latestOrder.shippingStatus}` : ''}`,
        quickReplies: [
          { title: 'Xem chi tiết đơn hàng', payload: `ORDER_${latestOrder._id}` },
          { title: 'Theo dõi vận chuyển', payload: 'ORDER_TRACKING' },
          { title: 'Gặp nhân viên', payload: 'HANDOFF' },
        ],
        metadata: { 
          intent: IntentType.ORDER_STATUS,
          orderId: latestOrder._id.toString(),
        },
      };
    } catch (error) {
      console.error('Error handling order status:', error);
      return {
        content: 'Em xin lỗi, có lỗi xảy ra khi kiểm tra đơn hàng. Anh/chị có muốn gặp nhân viên để được hỗ trợ tốt hơn không?',
        quickReplies: [
          { title: 'Gặp nhân viên', payload: 'HANDOFF' },
        ],
        metadata: { intent: IntentType.ORDER_STATUS },
      };
    }
  }

  private async handleOrderTracking(
    userId: string,
    entities: IntentResult['entities'],
    context: ConversationContext,
  ): Promise<ChatbotResponse> {
    try {
      const orders = await this.orderService.getOrderUser(userId);
      
      if (!orders || orders.length === 0) {
        return {
          content: 'Em không tìm thấy đơn hàng nào để theo dõi.',
          metadata: { intent: IntentType.ORDER_TRACKING },
        };
      }

      const orderId = entities?.orderId || context.lastOrderId;
      let order;

      if (orderId) {
        order = orders.find(o => 
          o._id.toString().includes(orderId) || 
          o._id.toString().toLowerCase() === orderId.toLowerCase()
        );
      }

      if (!order) {
        order = orders[orders.length - 1]; // Lấy đơn gần nhất
      }

      const shippingStatus = order.shippingStatus || 'Chưa có thông tin';
      const estimatedDelivery = '3-5 ngày làm việc'; // Có thể lấy từ order nếu có

      return {
        content: `Đơn hàng #${order._id.toString().slice(-6)} của anh/chị: ${shippingStatus}. Thời gian giao hàng dự kiến: ${estimatedDelivery}.`,
        quickReplies: [
          { title: 'Xem chi tiết đơn hàng', payload: `ORDER_${order._id}` },
          { title: 'Kiểm tra trạng thái', payload: 'ORDER_STATUS' },
        ],
        metadata: { 
          intent: IntentType.ORDER_TRACKING,
          orderId: order._id.toString(),
        },
      };
    } catch (error) {
      console.error('Error handling order tracking:', error);
      return {
        content: 'Em xin lỗi, không thể tra cứu thông tin vận chuyển. Anh/chị có muốn gặp nhân viên không?',
        quickReplies: [
          { title: 'Gặp nhân viên', payload: 'HANDOFF' },
        ],
        metadata: { intent: IntentType.ORDER_TRACKING },
      };
    }
  }

  private handleOrderModification(intent: IntentType): ChatbotResponse {
    const isCancel = intent === IntentType.ORDER_CANCEL;
    return {
      content: isCancel
        ? 'Để hủy đơn hàng, anh/chị vui lòng liên hệ trực tiếp với nhân viên để được hỗ trợ tốt nhất. Em có thể chuyển anh/chị sang nhân viên ngay bây giờ.'
        : 'Để thay đổi đơn hàng, anh/chị vui lòng liên hệ với nhân viên. Em có thể chuyển anh/chị sang nhân viên ngay bây giờ.',
      quickReplies: [
        { title: 'Gặp nhân viên', payload: 'HANDOFF' },
        { title: 'Kiểm tra đơn hàng', payload: 'CHECK_ORDER' },
      ],
      metadata: { intent },
    };
  }

  private async handleProductSearch(
    entities: IntentResult['entities'],
    context: ConversationContext,
  ): Promise<ChatbotResponse> {
    try {
      // Tìm từ khóa sản phẩm trong message (nhẫn, vòng, dây chuyền, v.v.)
      const searchKeywords = [
        'nhẫn', 'ring',
        'vòng', 'bracelet',
        'dây chuyền', 'necklace', 'chain',
        'bông tai', 'earring',
        'lắc tay', 'anklet',
        'vòng cổ', 'collar',
        'trang sức', 'jewelry',
      ];

      let searchTerm = '';
      let matchedProducts = [];
      const lastMessage = context.conversationHistory[context.conversationHistory.length - 1]?.message || '';
      
      console.log('ChatbotService: handleProductSearch', {
        entities,
        lastMessage,
        hasProductName: !!entities?.productName,
      });
      
      if (entities?.productName) {
        // Tìm kiếm trực tiếp trong MongoDB với từ khóa từ entities
        // Lấy từ gốc từ lastMessage thay vì dùng normalized version
        const originalMessage = context.conversationHistory[context.conversationHistory.length - 1]?.message || '';
        const normalizedEntity = entities.productName.toLowerCase();
        
        // Tìm từ gốc trong message (có dấu) thay vì dùng normalized
        const words = originalMessage.toLowerCase().split(/\s+/);
        const foundWord = words.find(w => 
          this.normalizeText(w) === normalizedEntity || 
          w.includes(normalizedEntity) ||
          normalizedEntity.includes(this.normalizeText(w))
        );
        
        searchTerm = foundWord || entities.productName;
        console.log('ChatbotService: Searching with entity productName:', searchTerm, '(original:', entities.productName, ')');
        
        // Tìm với cả 2 version: có dấu và không dấu
        matchedProducts = await this.productService.searchProducts(searchTerm);
        
        // Nếu không tìm thấy với version có dấu, thử version không dấu
        if (matchedProducts.length === 0 && foundWord && foundWord !== normalizedEntity) {
          console.log('ChatbotService: Retrying search with normalized term:', normalizedEntity);
          matchedProducts = await this.productService.searchProducts(normalizedEntity);
        }
      } else if (lastMessage) {
        // Lấy message gần nhất và tìm keyword
        const lastMessageLower = lastMessage.toLowerCase();
        
        // Tìm keyword trong message
        const foundKeyword = searchKeywords.find(keyword => 
          lastMessageLower.includes(keyword)
        );
        
        if (foundKeyword) {
          // Tìm kiếm trực tiếp trong MongoDB với keyword
          searchTerm = foundKeyword;
          console.log('ChatbotService: Searching with found keyword:', searchTerm);
          matchedProducts = await this.productService.searchProducts(foundKeyword);
        } else {
          // Nếu không tìm thấy keyword cụ thể, tìm với toàn bộ message
          // Loại bỏ các từ không cần thiết như "tôi", "muốn", "mua"
          const words = lastMessageLower
            .split(/\s+/)
            .filter(w => w.length > 2 && !['tôi', 'muốn', 'mua', 'xem', 'tìm'].includes(w));
          
          if (words.length > 0) {
            searchTerm = words.join(' ');
            console.log('ChatbotService: Searching with message words:', searchTerm);
            matchedProducts = await this.productService.searchProducts(searchTerm);
          } else {
            // Nếu không có từ nào hợp lệ, lấy tất cả sản phẩm
            console.log('ChatbotService: No valid search term, getting all products');
            matchedProducts = await this.productService.getAllProducts();
          }
        }
      } else {
        // Nếu không có message, lấy tất cả sản phẩm
        console.log('ChatbotService: No message, getting all products');
        matchedProducts = await this.productService.getAllProducts();
      }
      
      console.log('ChatbotService: Search results', {
        searchTerm,
        matchedCount: matchedProducts.length,
      });

      if (matchedProducts.length === 0) {
        return {
          content: 'Em không tìm thấy sản phẩm phù hợp. Anh/chị có thể xem tất cả sản phẩm trên website hoặc cho em biết cụ thể hơn anh/chị đang tìm gì ạ?',
          quickReplies: [
            { title: 'Xem tất cả sản phẩm', payload: 'VIEW_PRODUCTS' },
            { title: 'Gặp nhân viên', payload: 'HANDOFF' },
          ],
          metadata: { intent: IntentType.PRODUCT_SEARCH },
        };
      }

      // Giới hạn hiển thị 5 sản phẩm đầu tiên
      const displayProducts = matchedProducts.slice(0, 5);
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      
      // Text ngắn gọn vì sẽ hiển thị product cards
      const moreText = matchedProducts.length > 5 
        ? `\n\n📦 Và còn ${matchedProducts.length - 5} sản phẩm khác...` 
        : '';

      return {
        content: `🎉 Em tìm thấy ${matchedProducts.length} sản phẩm phù hợp cho anh/chị:${moreText}`,
        quickReplies: [
          { title: 'Xem tất cả sản phẩm', payload: 'VIEW_PRODUCTS' },
          { title: 'Hỏi về giá', payload: 'PRODUCT_PRICE' },
          { title: 'Gặp nhân viên', payload: 'HANDOFF' },
        ],
        metadata: { 
          intent: IntentType.PRODUCT_SEARCH,
          productId: displayProducts[0]?._id?.toString(),
          productLinks: displayProducts.map(p => ({
            productId: p._id.toString(),
            url: `${frontendUrl}/products/${p._id}`,
            name: p.name,
            price: p.salePrice,
            image: p.images && p.images.length > 0 ? p.images[0] : null,
          })),
        },
      };
    } catch (error) {
      console.error('Error handling product search:', error);
      return {
        content: 'Em xin lỗi, có lỗi xảy ra khi tìm kiếm sản phẩm. Anh/chị có thể xem trên website hoặc liên hệ nhân viên để được hỗ trợ.',
        quickReplies: [
          { title: 'Xem sản phẩm', payload: 'VIEW_PRODUCTS' },
          { title: 'Gặp nhân viên', payload: 'HANDOFF' },
        ],
        metadata: { intent: IntentType.PRODUCT_SEARCH },
      };
    }
  }

  private async handleProductPrice(
    entities: IntentResult['entities'],
    context: ConversationContext,
  ): Promise<ChatbotResponse> {
    if (!entities?.productName && !context.lastProductId) {
      return {
        content: 'Anh/chị muốn hỏi giá sản phẩm nào ạ? Vui lòng cho em biết tên sản phẩm.',
        quickReplies: [
          { title: 'Xem sản phẩm', payload: 'VIEW_PRODUCTS' },
          { title: 'Gặp nhân viên', payload: 'HANDOFF' },
        ],
        metadata: { intent: IntentType.PRODUCT_PRICE },
      };
    }

    // Tìm sản phẩm
    try {
      const products = await this.productService.getAllProducts();
      const product = products.find(p => 
        p.name?.toLowerCase().includes(entities?.productName?.toLowerCase() || '') ||
        p._id.toString() === context.lastProductId
      );

      if (product) {
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        const productUrl = `${frontendUrl}/products/${product._id}`;
        
        return {
          content: `Sản phẩm "${product.name}" có giá: ${product.salePrice?.toLocaleString('vi-VN')}đ (Giá gốc: ${product.originalPrice?.toLocaleString('vi-VN')}đ).\n\n🔗 Xem chi tiết: ${productUrl}`,
          quickReplies: [
            { title: 'Xem chi tiết sản phẩm', payload: `PRODUCT_${product._id}` },
            { title: 'Kiểm tra tồn kho', payload: 'PRODUCT_STOCK' },
          ],
          metadata: { 
            intent: IntentType.PRODUCT_PRICE,
            productId: product._id.toString(),
            productUrl,
          },
        };
      }
    } catch (error) {
      console.error('Error handling product price:', error);
    }

    return {
      content: 'Em không tìm thấy thông tin giá của sản phẩm này. Anh/chị có thể xem trên website hoặc liên hệ nhân viên để biết thêm chi tiết.',
      quickReplies: [
        { title: 'Xem sản phẩm', payload: 'VIEW_PRODUCTS' },
        { title: 'Gặp nhân viên', payload: 'HANDOFF' },
      ],
      metadata: { intent: IntentType.PRODUCT_PRICE },
    };
  }

  private async handleProductStock(
    entities: IntentResult['entities'],
    context: ConversationContext,
  ): Promise<ChatbotResponse> {
    if (!entities?.productName && !context.lastProductId) {
      return {
        content: 'Anh/chị muốn kiểm tra tồn kho sản phẩm nào ạ?',
        metadata: { intent: IntentType.PRODUCT_STOCK },
      };
    }

    try {
      const products = await this.productService.getAllProducts();
      const product = products.find(p => 
        p.name?.toLowerCase().includes(entities?.productName?.toLowerCase() || '') ||
        p._id.toString() === context.lastProductId
      );

      if (product) {
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        const productUrl = `${frontendUrl}/products/${product._id}`;
        
        // Product schema không có quantity field, nên trả về thông báo chung
        return {
          content: `Sản phẩm "${product.name}" hiện đang có sẵn. Để biết chính xác số lượng tồn kho, anh/chị vui lòng liên hệ nhân viên hoặc xem trên website.\n\n🔗 Xem chi tiết: ${productUrl}`,
          quickReplies: [
            { title: 'Xem chi tiết', payload: `PRODUCT_${product._id}` },
            { title: 'Xem sản phẩm khác', payload: 'VIEW_PRODUCTS' },
            { title: 'Gặp nhân viên', payload: 'HANDOFF' },
          ],
          metadata: { 
            intent: IntentType.PRODUCT_STOCK,
            productId: product._id.toString(),
            productUrl,
          },
        };
      }
    } catch (error) {
      console.error('Error handling product stock:', error);
    }

    return {
      content: 'Em không tìm thấy thông tin tồn kho. Vui lòng liên hệ nhân viên để biết thêm chi tiết.',
      quickReplies: [
        { title: 'Gặp nhân viên', payload: 'HANDOFF' },
      ],
      metadata: { intent: IntentType.PRODUCT_STOCK },
    };
  }

  private async handleProductDetails(
    intent: IntentType,
    entities: IntentResult['entities'],
    context: ConversationContext,
  ): Promise<ChatbotResponse> {
    const detailType = intent === IntentType.PRODUCT_SIZE ? 'kích thước' : 'màu sắc';
    
    if (!entities?.productName && !context.lastProductId) {
      return {
        content: `Anh/chị muốn hỏi ${detailType} sản phẩm nào ạ?`,
        metadata: { intent },
      };
    }

    try {
      const products = await this.productService.getAllProducts();
      const product = products.find(p => 
        p.name?.toLowerCase().includes(entities?.productName?.toLowerCase() || '') ||
        p._id.toString() === context.lastProductId
      );

      if (product) {
        let detail: string;
        if (intent === IntentType.PRODUCT_SIZE) {
          detail = product.size || 'Chưa có thông tin';
        } else {
          // Product schema không có color field
          detail = 'Chưa có thông tin màu sắc. Vui lòng xem trên website hoặc liên hệ nhân viên.';
        }
        
        return {
          content: `Sản phẩm "${product.name}" có ${detailType}: ${detail}.`,
          metadata: { 
            intent,
            productId: product._id.toString(),
          },
        };
      }
    } catch (error) {
      console.error('Error handling product details:', error);
    }

    return {
      content: `Em không tìm thấy thông tin ${detailType} của sản phẩm này.`,
      metadata: { intent },
    };
  }

  private handleProductCompare(): ChatbotResponse {
    return {
      content: 'Em có thể giúp anh/chị so sánh sản phẩm. Vui lòng cho em biết tên 2 sản phẩm cần so sánh, hoặc anh/chị có thể xem trên website.',
      quickReplies: [
        { title: 'Xem sản phẩm', payload: 'VIEW_PRODUCTS' },
        { title: 'Gặp nhân viên', payload: 'HANDOFF' },
      ],
      metadata: { intent: IntentType.PRODUCT_COMPARE },
    };
  }

  private handlePolicyReturn(): ChatbotResponse {
    return {
      content: 'Chính sách đổi trả: Anh/chị có thể đổi/trả hàng trong vòng 7 ngày kể từ ngày nhận hàng. Hàng phải còn nguyên vẹn, chưa sử dụng. Vui lòng liên hệ nhân viên để được hướng dẫn chi tiết.',
      quickReplies: [
        { title: 'Gặp nhân viên', payload: 'HANDOFF' },
        { title: 'Chính sách bảo hành', payload: 'WARRANTY_POLICY' },
      ],
      metadata: { intent: IntentType.POLICY_RETURN },
    };
  }

  private handlePolicyWarranty(): ChatbotResponse {
    return {
      content: 'Chính sách bảo hành: Sản phẩm được bảo hành 12 tháng kể từ ngày mua. Bảo hành bao gồm lỗi do nhà sản xuất. Vui lòng giữ hóa đơn để được bảo hành.',
      quickReplies: [
        { title: 'Gặp nhân viên', payload: 'HANDOFF' },
        { title: 'Chính sách đổi trả', payload: 'RETURN_POLICY' },
      ],
      metadata: { intent: IntentType.POLICY_WARRANTY },
    };
  }

  private handlePolicyShipping(): ChatbotResponse {
    return {
      content: 'Phí vận chuyển: Miễn phí ship cho đơn hàng trên 500.000đ. Dưới 500.000đ phí ship 30.000đ. Thời gian giao hàng: 3-5 ngày làm việc (nội thành), 5-7 ngày (ngoại thành).',
      metadata: { intent: IntentType.POLICY_SHIPPING },
    };
  }

  private handlePolicyPayment(): ChatbotResponse {
    return {
      content: 'Hình thức thanh toán: Thanh toán khi nhận hàng (COD), Chuyển khoản ngân hàng, Ví điện tử (ZaloPay, VNPay).',
      metadata: { intent: IntentType.POLICY_PAYMENT },
    };
  }

  private handleSupportHours(): ChatbotResponse {
    return {
      content: 'Giờ làm việc: Thứ 2 - Chủ nhật, từ 8:00 - 22:00. Hỗ trợ online 24/7.',
      metadata: { intent: IntentType.SUPPORT_HOURS },
    };
  }

  private handleSupportAddress(): ChatbotResponse {
    return {
      content: 'Địa chỉ cửa hàng: Vui lòng liên hệ nhân viên để biết địa chỉ cửa hàng gần nhất hoặc xem trên website.',
      quickReplies: [
        { title: 'Liên hệ CSKH', payload: 'CONTACT_SUPPORT' },
        { title: 'Gặp nhân viên', payload: 'HANDOFF' },
      ],
      metadata: { intent: IntentType.SUPPORT_ADDRESS },
    };
  }

  private handleSupportContact(): ChatbotResponse {
    return {
      content: 'Liên hệ CSKH: Hotline: 1900-xxxx, Email: support@example.com. Hoặc anh/chị có thể chat trực tiếp với nhân viên ngay bây giờ.',
      quickReplies: [
        { title: 'Gặp nhân viên', payload: 'HANDOFF' },
      ],
      metadata: { intent: IntentType.SUPPORT_CONTACT },
    };
  }

  private handleUnknown(context: ConversationContext): ChatbotResponse {
    const unknownCount = context.unknownCount;
    
    if (unknownCount >= 2) {
      return {
        content: 'Em chưa hiểu rõ câu hỏi của anh/chị. Anh/chị đang muốn hỏi về đơn hàng, sản phẩm, hay chính sách ạ? Hoặc em có thể chuyển anh/chị sang nhân viên để được hỗ trợ tốt hơn.',
        quickReplies: [
          { title: 'Đơn hàng', payload: 'CHECK_ORDER' },
          { title: 'Sản phẩm', payload: 'VIEW_PRODUCTS' },
          { title: 'Chính sách', payload: 'RETURN_POLICY' },
          { title: 'Gặp nhân viên', payload: 'HANDOFF' },
        ],
        metadata: { intent: IntentType.UNKNOWN },
      };
    }

    return {
      content: 'Em chưa hiểu rõ câu hỏi của anh/chị. Anh/chị có thể hỏi về đơn hàng, sản phẩm, hoặc chính sách. Em có thể giúp gì khác không ạ?',
      quickReplies: [
        { title: 'Kiểm tra đơn hàng', payload: 'CHECK_ORDER' },
        { title: 'Xem sản phẩm', payload: 'VIEW_PRODUCTS' },
        { title: 'Gặp nhân viên', payload: 'HANDOFF' },
      ],
      metadata: { intent: IntentType.UNKNOWN },
    };
  }

  private handleHandoff(
    userId: string,
    context: ConversationContext,
  ): ChatbotResponse {
    this.contextManager.requestHandoff(userId);
    
    return {
      content: 'Em sẽ chuyển anh/chị sang nhân viên tư vấn ngay bây giờ. Nhân viên sẽ hỗ trợ anh/chị trong giây lát.',
      metadata: { 
        intent: IntentType.HANDOFF_REQUEST,
        handoffRequested: true,
      },
    };
  }

  getBotUserId(): string {
    return this.BOT_USER_ID;
  }

  private normalizeText(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .trim();
  }
}

