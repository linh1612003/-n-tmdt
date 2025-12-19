// Script to fix product categoryId to match category _id exactly
// Usage: node scripts/fix-products-category.js

require('dotenv').config();
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({}, { strict: false });
const categorySchema = new mongoose.Schema({}, { strict: false });

const Product = mongoose.model('Product', productSchema);
const Category = mongoose.model('Category', categorySchema);

async function fixProductsCategory() {
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
    console.log(`Found ${categories.length} categories\n`);

    // Get all products
    const products = await Product.find();
    console.log(`Found ${products.length} products\n`);

    let fixedCount = 0;
    let noMatchCount = 0;

    for (const product of products) {
      if (!product.categoryId) {
        console.log(`⚠️  ${product.name} - No categoryId`);
        noMatchCount++;
        continue;
      }

      const productCategoryId = product.categoryId.toString();
      
      // Tìm category khớp chính xác
      let matchedCategory = categories.find(cat => 
        cat._id.toString() === productCategoryId
      );
      
      // Nếu không tìm thấy khớp chính xác, thử map theo typeId hoặc tên sản phẩm
      if (!matchedCategory && product.typeId) {
        const typeToCategoryMap = {
          'ring': 'Nhẫn',
          'necklace': 'Dây chuyền',
          'bracelet': 'Vòng tay',
          'earring': 'Bông tai',
          'anklet': 'Lắc chân',
        };
        
        const categoryName = typeToCategoryMap[product.typeId];
        if (categoryName) {
          matchedCategory = categories.find(cat => cat.name === categoryName);
        }
      }
      
      // Nếu vẫn không tìm thấy, thử tìm theo tên sản phẩm
      if (!matchedCategory) {
        const productName = product.name.toLowerCase();
        for (const category of categories) {
          const categoryNameLower = category.name.toLowerCase();
          if (productName.includes(categoryNameLower) || 
              (categoryNameLower === 'nhẫn' && productName.includes('ring')) ||
              (categoryNameLower === 'dây chuyền' && productName.includes('necklace')) ||
              (categoryNameLower === 'vòng tay' && productName.includes('bracelet')) ||
              (categoryNameLower === 'bông tai' && productName.includes('earring')) ||
              (categoryNameLower === 'lắc chân' && productName.includes('anklet'))) {
            matchedCategory = category;
            break;
          }
        }
      }

      if (matchedCategory) {
        const correctCategoryId = matchedCategory._id.toString();
        if (productCategoryId !== correctCategoryId) {
          await Product.findByIdAndUpdate(product._id, { 
            categoryId: correctCategoryId 
          });
          console.log(`✅ Fixed ${product.name}`);
          console.log(`   Old: ${productCategoryId}`);
          console.log(`   New: ${correctCategoryId}`);
          fixedCount++;
        }
      } else {
        console.log(`❌ ${product.name} - No matching category for categoryId: ${productCategoryId}`);
        noMatchCount++;
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`✅ Fixed: ${fixedCount} products`);
    console.log(`❌ No match: ${noMatchCount} products`);

    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixProductsCategory();

