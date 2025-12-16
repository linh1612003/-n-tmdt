import { Document } from 'mongoose';
export declare class Product extends Document {
    name: string;
    images: string[];
    description: string;
    descriptionFull: string;
    originalPrice: number;
    salePrice: number;
    material: string;
    weight: number;
    size: string;
    gender: string;
    style: string;
    brand: string;
    origin: string;
    warranty: string;
    typeId: string;
}
export declare const ProductSchema: import("mongoose").Schema<Product, import("mongoose").Model<Product, any, any, any, Document<unknown, any, Product> & Product & Required<{
    _id: unknown;
}>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Product, Document<unknown, {}, import("mongoose").FlatRecord<Product>> & import("mongoose").FlatRecord<Product> & Required<{
    _id: unknown;
}>>;
