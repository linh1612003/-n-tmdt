import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDto } from '../dto/createProduct.dto';
import { Product } from '../schema/product.shema';
import { ObjectId } from 'mongodb';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectModel(Product.name)
    private productModel: Model<Product>,
  ) {}

  async getAll() {
    return await this.productModel.find();
  }
  async findById(id: string) {
    return await this.productModel.findById(id);
  }

  async findAllAndSort(sortOrder: string) {
    console.log('sortOrder in repo: ' + sortOrder);
    if (sortOrder === 'asc') {
      return await this.productModel.find().sort({ salePrice: 'asc' });
    }
    return await this.productModel.find().sort({ salePrice: 'desc' });
  }

  async getProductByTypeId(typeId: string) {
    try {
      const typeIdObject = new ObjectId(typeId);
      return await this.productModel.find({ typeId: typeIdObject });
    } catch (err) {
      throw new HttpException(
        'Find product by type id error',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getProductByTypeIds(typeIds: ObjectId[]) {
    return await this.productModel.find({ typeId: { $in: typeIds } });
  }

  async getProductsByCategoryId(categoryId: string) {
    // Hỗ trợ cả ObjectId và string
    try {
      const categoryIdObject = new ObjectId(categoryId);
      return await this.productModel.find({ 
        $or: [
          { categoryId: categoryId },
          { categoryId: categoryIdObject },
          { categoryId: categoryId.toString() }
        ]
      });
    } catch (err) {
      return await this.productModel.find({ categoryId: categoryId });
    }
  }

  async countProductsByCategoryId(categoryId: string) {
    // So sánh categoryId - hỗ trợ cả string và ObjectId
    try {
      // Thử so sánh với string trước (vì categoryId có thể được lưu dưới dạng string)
      let count = await this.productModel.countDocuments({ categoryId: categoryId });
      
      // Nếu không tìm thấy, thử với ObjectId
      if (count === 0) {
        try {
          const categoryIdObject = new ObjectId(categoryId);
          count = await this.productModel.countDocuments({ categoryId: categoryIdObject });
        } catch (err) {
          // categoryId không phải ObjectId hợp lệ, giữ nguyên count = 0
        }
      }
      
      return count;
    } catch (err) {
      console.error('Error counting products by categoryId:', err);
      return 0;
    }
  }

  async updateImagesOfProduct(productId: string, urlFiles: string[]) {
    return await this.productModel.findOneAndUpdate(
      { _id: productId },
      {
        images: urlFiles,
      },
    );
  }

  async create(data: any) {
    const createdProduct = new this.productModel(data);
    return createdProduct.save();
  }

  async deleteById(productId: string) {
    return await this.productModel.findByIdAndDelete(productId);
  }

  async updateById(productId: string, createProductDto: CreateProductDto) {
    return await this.productModel.findByIdAndUpdate(
      productId,
      createProductDto,
      {
        new: true,
      },
    );
  }

  async updateProductsCategoryId(oldCategoryId: string, newCategoryId: string) {
    try {
      // Hỗ trợ cả ObjectId và string
      const oldCategoryIdObject = new ObjectId(oldCategoryId);
      const result = await this.productModel.updateMany(
        {
          $or: [
            { categoryId: oldCategoryId },
            { categoryId: oldCategoryIdObject },
            { categoryId: oldCategoryId.toString() }
          ]
        },
        { $set: { categoryId: newCategoryId } }
      );
      return result;
    } catch (err) {
      // Nếu không phải ObjectId hợp lệ, chỉ update với string
      return await this.productModel.updateMany(
        { categoryId: oldCategoryId },
        { $set: { categoryId: newCategoryId } }
      );
    }
  }
}
