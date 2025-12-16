import { ProductOrder } from 'src/interface/product-order.interface';
declare class ShippingInfoDto {
    receiver: string;
    phone: string;
    address: string;
    addressDetail: string;
}
export declare class CreateOrderDto {
    userId: string;
    products: ProductOrder[];
    shippingInfo?: ShippingInfoDto;
    isInCart?: Boolean;
}
export {};
