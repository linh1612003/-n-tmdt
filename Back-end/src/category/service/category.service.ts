import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CategoryRepository } from '../repository/category.repository';
import { CreateCategoryDto } from '../dto/CreateCategory.dto';
import { ProductRepository } from 'src/product/repository/product.repository';
@Injectable()
export class CategoryService {
  constructor(
    private categoryRepository: CategoryRepository,
    private productRepository: ProductRepository,
  ) {}

  async getAllCategories() {
    return await this.categoryRepository.getAll();
  }

  async ensureOtherCategoryExists() {
    // Đảm bảo category "Khác" tồn tại
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

  async deleteCategory(categoryId: string) {
    try {
      // Kiểm tra category có tồn tại không
      const categoryToDelete = await this.categoryRepository.findById(categoryId);
      if (!categoryToDelete) {
        throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
      }

      console.log(`🗑️  Đang xóa category: ${categoryToDelete.name} (ID: ${categoryId})`);

      // Tìm hoặc tạo category "Khác"
      let otherCategory = await this.categoryRepository.findByName('Khác');
      
      if (!otherCategory) {
        // Tạo category "Khác" nếu chưa có
        otherCategory = await this.categoryRepository.create({ name: 'Khác' });
        console.log('✅ Created category "Khác" with ID:', otherCategory._id);
      } else {
        console.log('✅ Category "Khác" đã tồn tại (ID:', otherCategory._id + ')');
      }

      // Tìm tất cả products có categoryId = categoryId bị xóa
      const products = await this.productRepository.getProductsByCategoryId(categoryId);
      
      if (products && products.length > 0) {
        const otherCategoryId = otherCategory._id.toString();
        
        console.log(`📦 Tìm thấy ${products.length} sản phẩm cần chuyển sang category "Khác"`);
        
        // Cập nhật tất cả products cùng lúc
        const updateResult = await this.productRepository.updateProductsCategoryId(categoryId, otherCategoryId);
        
        console.log(`✅ Đã chuyển ${updateResult.modifiedCount || products.length} sản phẩm sang category "Khác"`);
      } else {
        console.log('ℹ️  Không có sản phẩm nào thuộc category này');
      }

      // Xóa category sau khi đã chuyển products
      const deletedCategory = await this.categoryRepository.delete(categoryId);
      console.log(`✅ Đã xóa category: ${categoryToDelete.name}`);
      
      return {
        message: `Đã xóa category "${categoryToDelete.name}" và chuyển ${products?.length || 0} sản phẩm sang category "Khác"`,
        deletedCategory,
        productsMoved: products?.length || 0,
      };
    } catch (err) {
      console.error('❌ Error deleting category:', err);
      if (err instanceof HttpException) {
        throw err;
      }
      throw new HttpException(
        err.message || 'Error deleting category',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateCategory(
    categoryId: string,
    createCategoryDto: CreateCategoryDto,
) {
    const categoryExist = await this.categoryRepository.findById(categoryId);

    if (!categoryExist) {
        throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }
    
    try {
      // Kiểm tra tên danh mục đã tồn tại chưa (trừ category hiện tại)
      const existingCategory = await this.categoryRepository.findByName(createCategoryDto.name);
      if (existingCategory && existingCategory._id.toString() !== categoryId) {
        throw new HttpException(
          `Danh mục với tên "${createCategoryDto.name}" đã tồn tại`,
          HttpStatus.BAD_REQUEST,
        );
      }

      const updatedCategory = await this.categoryRepository.update(categoryId, createCategoryDto);
      
      if (!updatedCategory) {
        throw new HttpException('Failed to update category', HttpStatus.BAD_REQUEST);
      }
      
      return updatedCategory;
    } catch (error) {
      console.error('Error updating category:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      // Kiểm tra lỗi duplicate key từ MongoDB
      if (error.code === 11000) {
        throw new HttpException(
          `Danh mục với tên "${createCategoryDto.name}" đã tồn tại`,
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        error.message || 'An error occurred while updating the category',
        HttpStatus.BAD_REQUEST,
      );
    }
}

  async createCategory(createCategoryDto: CreateCategoryDto) {
    try {
      // Kiểm tra tên danh mục đã tồn tại chưa
      const existingCategory = await this.categoryRepository.findByName(createCategoryDto.name);
      if (existingCategory) {
        throw new HttpException(
          `Danh mục với tên "${createCategoryDto.name}" đã tồn tại`,
          HttpStatus.BAD_REQUEST,
        );
      }

      const Newcategory = await this.categoryRepository.create(createCategoryDto);
      return {
        message: 'Create category success',
        data: Newcategory,
      };
    } catch (err) {
      console.log('Create category error:', err);
      if (err instanceof HttpException) {
        throw err;
      }
      // Kiểm tra lỗi duplicate key từ MongoDB
      if (err.code === 11000) {
        throw new HttpException(
          `Danh mục với tên "${createCategoryDto.name}" đã tồn tại`,
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        err.message || 'Create category error',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
