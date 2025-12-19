export declare enum IntentType {
    ORDER_STATUS = "ORDER_STATUS",
    ORDER_TRACKING = "ORDER_TRACKING",
    ORDER_CANCEL = "ORDER_CANCEL",
    ORDER_CHANGE = "ORDER_CHANGE",
    PRODUCT_SEARCH = "PRODUCT_SEARCH",
    PRODUCT_PRICE = "PRODUCT_PRICE",
    PRODUCT_STOCK = "PRODUCT_STOCK",
    PRODUCT_SIZE = "PRODUCT_SIZE",
    PRODUCT_COLOR = "PRODUCT_COLOR",
    PRODUCT_COMPARE = "PRODUCT_COMPARE",
    POLICY_RETURN = "POLICY_RETURN",
    POLICY_WARRANTY = "POLICY_WARRANTY",
    POLICY_SHIPPING = "POLICY_SHIPPING",
    POLICY_PAYMENT = "POLICY_PAYMENT",
    SUPPORT_HOURS = "SUPPORT_HOURS",
    SUPPORT_ADDRESS = "SUPPORT_ADDRESS",
    SUPPORT_CONTACT = "SUPPORT_CONTACT",
    HANDOFF_REQUEST = "HANDOFF_REQUEST",
    GREETING = "GREETING",
    UNKNOWN = "UNKNOWN"
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
export declare class IntentDetector {
    private readonly intentPatterns;
    detectIntent(message: string, context?: any): IntentResult;
    private normalizeText;
    private calculateConfidence;
    private calculateContextConfidence;
    private extractEntities;
}
