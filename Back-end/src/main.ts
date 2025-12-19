import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { CategoryService } from './category/service/category.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: 'Content-Type, Authorization, token',
  });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ 
    whitelist: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
    forbidNonWhitelisted: false,
    disableErrorMessages: false,
  }));
  
  // Tự động tạo category "Khác" khi server khởi động
  try {
    const categoryService = app.get(CategoryService);
    await categoryService.ensureOtherCategoryExists();
    console.log('✅ Category "Khác" đã được đảm bảo tồn tại');
  } catch (error) {
    console.error('⚠️  Không thể tạo category "Khác":', error.message);
  }
  
  await app.listen(5000);
  console.log('🚀 Server đang chạy tại http://localhost:5000');
}
bootstrap();
