import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateProductDto } from 'src/product/dto/CreateProduct.dto';
<<<<<<< HEAD
=======
import { UpdateProductDto } from 'src/product/dto/UpdateProduct.dto';
>>>>>>> origin/back-up
import { ProductService } from 'src/product/service/product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('recommend/:productId')
  async getRecommendedProducts(@Param('productId') productId: string) {
    return this.productService.getRecommendedProducts(productId);
  }

  @Post('')
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productService.createProduct(createProductDto);
  }

  @Get('get-all')
  getAllProduct() {
    return this.productService.getAllProducts();
  }

  @Get('type/:typeId')
  getProductByTypeId(@Param('typeId') typeId: string) {
    return this.productService.getProductByTypeId(typeId);
  }

  @Get(':productId')
  getProductById(@Param('productId') productId: string) {
    return this.productService.getProductById(productId);
  }

  @Get('')
  getProductsByFilter(@Query() filter: any) {
    return this.productService.getProductsByFilter(filter);
  }

  @Delete(':productId')
  deleteProductById(@Param('productId') productId: string) {
    return this.productService.deleteProductById(productId);
  }

  @Put(':productId')
  async updateProductById(
    @Param('productId') productId: string,
<<<<<<< HEAD
    @Body() updateProductDto: CreateProductDto,
  ) {
=======
    @Body() updateProductDto: UpdateProductDto,
  ) {
    console.log('Received update product request for ID:', productId);
    console.log('Update data:', JSON.stringify(updateProductDto, null, 2));
>>>>>>> origin/back-up
    return this.productService.updateProductById(productId, updateProductDto);
  }
}
