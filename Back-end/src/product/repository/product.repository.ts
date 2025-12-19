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
<<<<<<< HEAD
    return await this.productModel.aggregate([
      {
        $lookup: {
          from: 'types',
          localField: 'categoryIdString',
          foreignField: 'categoyrId',
          as: 'type',
        },
      },
    ]);
=======
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
>>>>>>> origin/back-up
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

<<<<<<< HEAD
  async searchProducts(searchTerm: string) {
    // Tìm kiếm trong MongoDB với regex (case-insensitive)
    // Escape special regex characters
    const escapedTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escapedTerm, 'i'); // 'i' = case insensitive
    
    // Tạo regex không phân biệt dấu tiếng Việt
    // Chuyển đổi các ký tự có dấu thành pattern có thể match cả có dấu và không dấu
    const normalizeVietnamese = (text: string): string => {
      const map: Record<string, string> = {
        'a': '[aàáạảãâầấậẩẫăằắặẳẵ]',
        'e': '[eèéẹẻẽêềếệểễ]',
        'i': '[iìíịỉĩ]',
        'o': '[oòóọỏõôồốộổỗơờớợởỡ]',
        'u': '[uùúụủũưừứựửữ]',
        'y': '[yỳýỵỷỹ]',
        'd': '[dđ]',
      };
      
      return text.split('').map(char => {
        const lower = char.toLowerCase();
        return map[lower] || char;
      }).join('');
    };
    
    // Tạo regex không phân biệt dấu
    const normalizedPattern = normalizeVietnamese(escapedTerm);
    const diacriticRegex = new RegExp(normalizedPattern, 'i');
    
    console.log('ProductRepository: Searching products with term:', searchTerm);
    console.log('ProductRepository: Using diacritic-insensitive regex');
    
    const results = await this.productModel.find({
      $or: [
        { name: { $regex: diacriticRegex } },
        { description: { $regex: diacriticRegex } },
        { descriptionFull: { $regex: diacriticRegex } },
        { material: { $regex: diacriticRegex } },
        { brand: { $regex: diacriticRegex } },
        { style: { $regex: diacriticRegex } },
        { origin: { $regex: diacriticRegex } },
      ],
    });
    
    console.log('ProductRepository: Found products:', results.length);
    return results;
=======
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
>>>>>>> origin/back-up
  }
}
