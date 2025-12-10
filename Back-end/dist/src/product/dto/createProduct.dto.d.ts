export declare class CreateProductDto {
    name: string;
    description: string;
    descriptionFull: string;
    originalPrice: number;
    salePrice: number;
    material: string;
    weight?: number;
    size?: string;
    gender?: string;
    style?: string;
    brand?: string;
    origin?: string;
    warranty?: string;
    typeId: string;
    categoryId: string;
    images: string[];
    quantity?: number;
    importPrice?: number;
}
