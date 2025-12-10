"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const category_service_1 = require("./category/service/category.service");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: ['http://localhost:3000'],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: 'Content-Type, Authorization, token',
    });
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
        forbidNonWhitelisted: false,
        disableErrorMessages: false,
    }));
    try {
        const categoryService = app.get(category_service_1.CategoryService);
        await categoryService.ensureOtherCategoryExists();
        console.log('✅ Category "Khác" đã được đảm bảo tồn tại');
    }
    catch (error) {
        console.error('⚠️  Không thể tạo category "Khác":', error.message);
    }
    await app.listen(5000);
    console.log('🚀 Server đang chạy tại http://localhost:5000');
}
bootstrap();
//# sourceMappingURL=main.js.map