import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ProductRepository } from '../repository/product.repository';
import { CreateProductDto } from '../dto/createProduct.dto';
import { UpdateProductDto } from '../dto/UpdateProduct.dto';
import { Types } from 'mongoose';
import { TypeService } from 'src/type/service/type.service';
import { Product } from '../schema/product.shema';
import * as natural from 'natural';
@Injectable()
export class ProductService {
  private tokenizer = new natural.WordTokenizer();
  private tfidf = new natural.TfIdf();
  private readonly _limit = 16;
  constructor(
    private productRepository: ProductRepository,
    private typeService: TypeService,
  ) { }

  async getRecommendedProducts(productId: string): Promise<Product[]> {
    // Lấy sản phẩm hiện tại
    const currentProduct = await this.productRepository.findById(productId);
    if (!currentProduct) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }

    // Lấy tất cả sản phẩm
    const allProducts = await this.productRepository.getAll();

    // Tạo danh sách văn bản từ các thuộc tính sản phẩm
    const documents = allProducts.map(product =>
      this.combineProductAttributes(product)
    );

    // Thêm mô tả của sản phẩm hiện tại vào danh sách tài liệu
    this.tfidf.addDocument(this.combineProductAttributes(currentProduct));
    documents.forEach(doc => this.tfidf.addDocument(doc));

    // Tính toán độ tương tự cho tất cả các sản phẩm
    const recommendedProducts = allProducts
      .filter(product => product._id.toString() !== productId)
      .map(product => ({
        product,
        similarity: this.calculateSimilarity(currentProduct, product),
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .map(item => item.product);

    return recommendedProducts.slice(0, 10);
  }

  private combineProductAttributes(product: Product): string {
    // Kết hợp các thuộc tính của sản phẩm trang sức thành một chuỗi văn bản
    return `${product.description} ${product.material} ${product.weight} ${product.size} ${product.gender} ${product.style} ${product.brand} ${product.origin} ${product.warranty}`;
  }

  private calculateSimilarity(product1: Product, product2: Product): number {
    const tfidf1 = new natural.TfIdf();
    const tfidf2 = new natural.TfIdf();

    const doc1 = this.combineProductAttributes(product1);
    const doc2 = this.combineProductAttributes(product2);

    tfidf1.addDocument(doc1);
    tfidf2.addDocument(doc2);

    const terms1 = tfidf1.listTerms(0);
    const terms2 = tfidf2.listTerms(0);

    // Tính tích vô hướng
    let dotProduct = 0;
    terms1.forEach(term1 => {
      const term1TFIDF = term1.tfidf;
      const term2 = terms2.find(t => t.term === term1.term);
      if (term2) {
        dotProduct += term1TFIDF * term2.tfidf;
      }
    });

    // Tính độ dài (norm) của vector
    const norm1 = Math.sqrt(terms1.reduce((sum, term) => sum + Math.pow(term.tfidf, 2), 0));
    const norm2 = Math.sqrt(terms2.reduce((sum, term) => sum + Math.pow(term.tfidf, 2), 0));

    // Tính cosine similarity
    return dotProduct / (norm1 * norm2);
  }

  async getAllProducts() {
    return await this.productRepository.getAll();
  }
  async getProductById(productId: string) {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
    return product;
  }

  async getProductByTypeId(typeId: string) {
    console.log('typeId :', typeId);
    return await this.productRepository.getProductByTypeId(typeId);
  }

  async getProductsByAvailabilityStatus(categoryId: string) {
    return await this.productRepository.getProductsByCategoryId(categoryId);
  }

  async updateImagesOfProduct(productId: string, urlFiles: string[]) {
    try {
      const product = await this.productRepository.findById(productId);
      console.log('updateImagesOfProduct - product:', product);
      if (!product) {
        console.error('updateImagesOfProduct - Product not found:', productId);
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }

      await this.productRepository.updateImagesOfProduct(productId, urlFiles);
      return {
        message: 'Update images success',
      };
    } catch (err) {
      console.error('updateImagesOfProduct - Error:', err);
      throw new HttpException(
        'Update images error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getProductsByFilter(filter: any) {
    let products;
    if (!filter.categoryId) {
      products = await this.productRepository.getAll();
    } else {
      products = await this.productRepository.getProductsByCategoryId(filter.categoryId);
    }

    const totalProducts = products.length;

    const filteredProducts = products.filter((product) => {
      return (
        (filter.categoryId == null || product.categoryId == filter.categoryId) &&
        (filter.color == null || product.color == filter.color) &&
        (filter.keyCount == null || product.keyCount == filter.keyCount) &&
        (filter.multiLayout == null ||
          product.multiLayout == filter.multiLayout)
      );
    });

    if (filter._sort) {
      const sortOrder = filter._sort === 'asc' ? 1 : -1;
      filteredProducts.sort((a, b) => sortOrder * (a.salePrice - b.salePrice));
    }

    const result = this.getProductsByPageNumber(filteredProducts, filter._page);

    return {
      rows: result,
      totalProducts,
      page: filter._page,
    };
  }

  getProductsByPageNumber(products: Product[], _page: number) {
    let skip = (_page - 1) * this._limit;
    const result = products.slice(skip, skip + this._limit);
    return result;
  }

  async createProduct(createProductDto: CreateProductDto) {
    // Lọc bỏ các phần tử rỗng trong mảng images nếu có
    if (createProductDto.images && Array.isArray(createProductDto.images)) {
      createProductDto.images = createProductDto.images.filter(link => link && link.trim() !== "");
    }
    // Không ép typeId sang ObjectId nữa, chỉ lưu nguyên giá trị chuỗi
    const data = { ...createProductDto };
    try {
      const Newproduct = await this.productRepository.create(data);
      return {
        message: 'Create product success',
      };
    } catch (err) {
      console.log(err);
      throw new HttpException('Create product error', HttpStatus.BAD_REQUEST);
    }
  }

  async deleteProductById(productId: string) {
    const productExist = await this.productRepository.findById(productId);
    if (!productExist) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
    try {
      await this.productRepository.deleteById(productId);
      return {
        message: 'Delete product success',
      };
    } catch (err) {
      throw new HttpException(
        'Delete product error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateProductById(
    productId: string,
    updateProductDto: UpdateProductDto,
  ) {
    console.log('Update product request:', JSON.stringify(updateProductDto, null, 2));
    
    const productExist = await this.productRepository.findById(productId);
    if (!productExist) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
    
    // Merge với dữ liệu cũ - chỉ cập nhật các field được gửi lên
    const updateData: any = {
      ...productExist.toObject(),
      ...updateProductDto,
    };
    
    // Lọc bỏ các phần tử rỗng trong mảng images nếu có
    if (updateData.images && Array.isArray(updateData.images)) {
      updateData.images = updateData.images.filter(link => link && link.trim() !== "");
    }
    
    // Loại bỏ _id và __v khỏi updateData
    delete updateData._id;
    delete updateData.__v;
    
    try {
      const updatedProduct = await this.productRepository.updateById(productId, updateData);
      return {
        message: 'update product success',
        data: updatedProduct,
      };
    } catch (err) {
      console.error('Error updating product:', err);
      throw new HttpException(
        err.message || 'update product error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
