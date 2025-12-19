declare class ShippingInfoDto {
    receiver: string;
    phone: string;
    address: string;
    addressDetail: string;
}
declare class ProductOrderDto {
    productId: string;
    price: number;
    quantity: number;
    urlImage: string;
}
export declare class CreateOrderDto {
    userId: string;
    products: ProductOrderDto[];
    shippingInfo?: ShippingInfoDto;
    isInCart?: Boolean;
}
export {};
