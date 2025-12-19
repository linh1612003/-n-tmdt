import { CategoryService } from './service/category.service';
import { CreateCategoryDto } from './dto/CreateCategory.dto';
export declare class CategoryController {
    private readonly categoryService;
    constructor(categoryService: CategoryService);
    createCategory(createCategoryDto: CreateCategoryDto): Promise<{
        message: string;
        data: import("mongoose").Document<unknown, {}, import("./schema/category.shema").Category> & import("./schema/category.shema").Category & {
            _id: import("mongoose").Types.ObjectId;
        };
    }>;
    getAllCategory(): Promise<(import("mongoose").Document<unknown, {}, import("./schema/category.shema").Category> & import("./schema/category.shema").Category & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    ensureOtherCategory(): Promise<{
        message: string;
        category: import("mongoose").Document<unknown, {}, import("./schema/category.shema").Category> & import("./schema/category.shema").Category & {
            _id: import("mongoose").Types.ObjectId;
        };
    }>;
    deleteCategory(categoryId: string): Promise<{
        message: string;
        deletedCategory: import("mongoose").Document<unknown, {}, import("./schema/category.shema").Category> & import("./schema/category.shema").Category & {
            _id: import("mongoose").Types.ObjectId;
        };
        productsMoved: number;
    }>;
    updateCategory(categoryId: string, createCategoryDto: CreateCategoryDto): Promise<import("mongoose").Document<unknown, {}, import("./schema/category.shema").Category> & import("./schema/category.shema").Category & {
        _id: import("mongoose").Types.ObjectId;
    }>;
}
