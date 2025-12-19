import { ProductOrder } from 'src/interface/product-order.interface';
import { ShippingInfoDto } from './ShippingInfo.dto';
export declare class CreateOrderDto {
    userId: string;
    products: ProductOrder[];
    shippingInfo?: ShippingInfoDto;
    isInCart?: Boolean;
}
