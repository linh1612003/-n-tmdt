"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const common_1 = require("@nestjs/common");
const category_repository_1 = require("../repository/category.repository");
const product_repository_1 = require("../../product/repository/product.repository");
let CategoryService = class CategoryService {
    constructor(categoryRepository, productRepository) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
    }
    async getAllCategories() {
        return await this.categoryRepository.getAll();
    }
    async ensureOtherCategoryExists() {
        let otherCategory = await this.categoryRepository.findByName('Khác');
        if (!otherCategory) {
            otherCategory = await this.categoryRepository.create({ name: 'Khác' });
            console.log('Created category "Khác" with ID:', otherCategory._id);
            return {
                message: 'Category "Khác" đã được tạo',
                category: otherCategory,
            };
        }
        return {
            message: 'Category "Khác" đã tồn tại',
            category: otherCategory,
        };
    }
    async deleteCategory(categoryId) {
        try {
            const categoryToDelete = await this.categoryRepository.findById(categoryId);
            if (!categoryToDelete) {
                throw new common_1.HttpException('Category not found', common_1.HttpStatus.NOT_FOUND);
            }
            console.log(`🗑️  Đang xóa category: ${categoryToDelete.name} (ID: ${categoryId})`);
            let otherCategory = await this.categoryRepository.findByName('Khác');
            if (!otherCategory) {
                otherCategory = await this.categoryRepository.create({ name: 'Khác' });
                console.log('✅ Created category "Khác" with ID:', otherCategory._id);
            }
            else {
                console.log('✅ Category "Khác" đã tồn tại (ID:', otherCategory._id + ')');
            }
            const products = await this.productRepository.getProductsByCategoryId(categoryId);
            if (products && products.length > 0) {
                const otherCategoryId = otherCategory._id.toString();
                console.log(`📦 Tìm thấy ${products.length} sản phẩm cần chuyển sang category "Khác"`);
                const updateResult = await this.productRepository.updateProductsCategoryId(categoryId, otherCategoryId);
                console.log(`✅ Đã chuyển ${updateResult.modifiedCount || products.length} sản phẩm sang category "Khác"`);
            }
            else {
                console.log('ℹ️  Không có sản phẩm nào thuộc category này');
            }
            const deletedCategory = await this.categoryRepository.delete(categoryId);
            console.log(`✅ Đã xóa category: ${categoryToDelete.name}`);
            return {
                message: `Đã xóa category "${categoryToDelete.name}" và chuyển ${products?.length || 0} sản phẩm sang category "Khác"`,
                deletedCategory,
                productsMoved: products?.length || 0,
            };
        }
        catch (err) {
            console.error('❌ Error deleting category:', err);
            if (err instanceof common_1.HttpException) {
                throw err;
            }
            throw new common_1.HttpException(err.message || 'Error deleting category', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async updateCategory(categoryId, createCategoryDto) {
        const categoryExist = await this.categoryRepository.findById(categoryId);
        if (!categoryExist) {
            throw new common_1.HttpException('Category not found', common_1.HttpStatus.NOT_FOUND);
        }
        try {
            const existingCategory = await this.categoryRepository.findByName(createCategoryDto.name);
            if (existingCategory && existingCategory._id.toString() !== categoryId) {
                throw new common_1.HttpException(`Danh mục với tên "${createCategoryDto.name}" đã tồn tại`, common_1.HttpStatus.BAD_REQUEST);
            }
            const updatedCategory = await this.categoryRepository.update(categoryId, createCategoryDto);
            if (!updatedCategory) {
                throw new common_1.HttpException('Failed to update category', common_1.HttpStatus.BAD_REQUEST);
            }
            return updatedCategory;
        }
        catch (error) {
            console.error('Error updating category:', error);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            if (error.code === 11000) {
                throw new common_1.HttpException(`Danh mục với tên "${createCategoryDto.name}" đã tồn tại`, common_1.HttpStatus.BAD_REQUEST);
            }
            throw new common_1.HttpException(error.message || 'An error occurred while updating the category', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async createCategory(createCategoryDto) {
        try {
            const existingCategory = await this.categoryRepository.findByName(createCategoryDto.name);
            if (existingCategory) {
                throw new common_1.HttpException(`Danh mục với tên "${createCategoryDto.name}" đã tồn tại`, common_1.HttpStatus.BAD_REQUEST);
            }
            const Newcategory = await this.categoryRepository.create(createCategoryDto);
            return {
                message: 'Create category success',
                data: Newcategory,
            };
        }
        catch (err) {
            console.log('Create category error:', err);
            if (err instanceof common_1.HttpException) {
                throw err;
            }
            if (err.code === 11000) {
                throw new common_1.HttpException(`Danh mục với tên "${createCategoryDto.name}" đã tồn tại`, common_1.HttpStatus.BAD_REQUEST);
            }
            throw new common_1.HttpException(err.message || 'Create category error', common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.CategoryService = CategoryService;
exports.CategoryService = CategoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [category_repository_1.CategoryRepository,
        product_repository_1.ProductRepository])
], CategoryService);
//# sourceMappingURL=category.service.js.map