import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CategoryService } from './service/category.service';
import { CreateCategoryDto } from './dto/CreateCategory.dto';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('')
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
<<<<<<< HEAD
=======
    console.log('Received createCategory request:', JSON.stringify(createCategoryDto, null, 2));
    console.log('createCategoryDto type:', typeof createCategoryDto);
    console.log('createCategoryDto keys:', Object.keys(createCategoryDto));
>>>>>>> origin/back-up
    return this.categoryService.createCategory(createCategoryDto);
  }

  @Get('')
  getAllCategory() {
<<<<<<< HEAD
    return this.categoryService.getAllCategory();
  }
  
  @Get(':availabilityStatus')
  getCategoryByAvailabilityStatus(@Param('availabilityStatus') availabilityStatus: string) {
    return this.categoryService.getCategoryByAvailabilityStatus(availabilityStatus);
=======
    return this.categoryService.getAllCategories();
  }

  @Post('ensure-other')
  ensureOtherCategory() {
    return this.categoryService.ensureOtherCategoryExists();
>>>>>>> origin/back-up
  }

  @Delete(':categoryId')
  deleteCategory(@Param('categoryId') categoryId: string) {
    return this.categoryService.deleteCategory(categoryId);
  }

  @Put(':categoryId')
  updateCategory(
    @Param('categoryId') categoryId: string,
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    return this.categoryService.updateCategory(categoryId, createCategoryDto);
  }
}
