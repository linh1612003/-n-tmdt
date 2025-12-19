import { CategoryRepository } from '../repository/category.repository';
import { CreateCategoryDto } from '../dto/CreateCategory.dto';
import { ProductRepository } from 'src/product/repository/product.repository';
export declare class CategoryService {
    private categoryRepository;
    private productRepository;
    constructor(categoryRepository: CategoryRepository, productRepository: ProductRepository);
    getAllCategories(): Promise<(import("mongoose").Document<unknown, {}, import("../schema/category.shema").Category> & import("../schema/category.shema").Category & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    ensureOtherCategoryExists(): Promise<{
        message: string;
        category: import("mongoose").Document<unknown, {}, import("../schema/category.shema").Category> & import("../schema/category.shema").Category & {
            _id: import("mongoose").Types.ObjectId;
        };
    }>;
    deleteCategory(categoryId: string): Promise<{
        message: string;
        deletedCategory: import("mongoose").Document<unknown, {}, import("../schema/category.shema").Category> & import("../schema/category.shema").Category & {
            _id: import("mongoose").Types.ObjectId;
        };
        productsMoved: number;
    }>;
    updateCategory(categoryId: string, createCategoryDto: CreateCategoryDto): Promise<import("mongoose").Document<unknown, {}, import("../schema/category.shema").Category> & import("../schema/category.shema").Category & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    createCategory(createCategoryDto: CreateCategoryDto): Promise<{
        message: string;
        data: import("mongoose").Document<unknown, {}, import("../schema/category.shema").Category> & import("../schema/category.shema").Category & {
            _id: import("mongoose").Types.ObjectId;
        };
    }>;
}
