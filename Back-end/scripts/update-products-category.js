// Script to update products with categoryId based on typeId
// Usage: node scripts/update-products-category.js

require('dotenv').config();
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({}, { strict: false });
const categorySchema = new mongoose.Schema({}, { strict: false });

const Product = mongoose.model('Product', productSchema);
const Category = mongoose.model('Category', categorySchema);

// Mapping từ typeId sang category name
const typeToCategoryMap = {
  'ring': 'Nhẫn',
  'necklace': 'Dây chuyền',
  'bracelet': 'Vòng tay',
  'earring': 'Bông tai',
  'anklet': 'Lắc chân',
};

async function updateProductsCategory() {
  try {
    if (!process.env.MONGO_CONNECTION_STRING) {
      console.error('❌ MONGO_CONNECTION_STRING not found in .env file');
      process.exit(1);
    }
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_CONNECTION_STRING.trim());
    console.log('✅ Connected to MongoDB\n');

    // Get all categories
    const categories = await Category.find();
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.name] = cat._id.toString();
    });

    console.log('Category mapping:');
    Object.keys(categoryMap).forEach(name => {
      console.log(`  ${name}: ${categoryMap[name]}`);
    });
    console.log('');

    // Get all products
    const products = await Product.find();
    console.log(`Found ${products.length} products\n`);

    let updatedCount = 0;
    let skippedCount = 0;

    for (const product of products) {
      let categoryId = null;

      // Nếu đã có categoryId, giữ nguyên
      if (product.categoryId) {
        console.log(`⚠️  ${product.name} already has categoryId: ${product.categoryId}`);
        skippedCount++;
        continue;
      }

      // Nếu có typeId, map sang categoryId
      if (product.typeId) {
        const categoryName = typeToCategoryMap[product.typeId];
        if (categoryName && categoryMap[categoryName]) {
          categoryId = categoryMap[categoryName];
        }
      }

      // Nếu không tìm thấy qua typeId, thử tìm theo tên sản phẩm
      if (!categoryId) {
        const productName = product.name.toLowerCase();
        for (const [typeId, categoryName] of Object.entries(typeToCategoryMap)) {
          if (productName.includes(typeId) || productName.includes(categoryName.toLowerCase())) {
            if (categoryMap[categoryName]) {
              categoryId = categoryMap[categoryName];
              break;
            }
          }
        }
      }

      // Nếu vẫn không tìm thấy, gán mặc định là danh mục đầu tiên
      if (!categoryId && categories.length > 0) {
        categoryId = categories[0]._id.toString();
        console.log(`⚠️  ${product.name} - Using default category: ${categories[0].name}`);
      }

      if (categoryId) {
        await Product.findByIdAndUpdate(product._id, { categoryId: categoryId });
        console.log(`✅ Updated ${product.name} - categoryId: ${categoryId}`);
        updatedCount++;
      } else {
        console.log(`❌ Could not update ${product.name} - no matching category`);
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`✅ Updated: ${updatedCount} products`);
    console.log(`⚠️  Skipped: ${skippedCount} products (already have categoryId)`);

    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

updateProductsCategory();

