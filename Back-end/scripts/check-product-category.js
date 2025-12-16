// Script to check product categoryId values
// Usage: node scripts/check-product-category.js

require('dotenv').config();
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({}, { strict: false });
const categorySchema = new mongoose.Schema({}, { strict: false });

const Product = mongoose.model('Product', productSchema);
const Category = mongoose.model('Category', categorySchema);

async function checkProductCategory() {
  try {
    await mongoose.connect(process.env.MONGO_CONNECTION_STRING.trim());
    console.log('✅ Connected to MongoDB\n');

    // Get all categories
    const categories = await Category.find();
    console.log(`Found ${categories.length} categories:\n`);
    categories.forEach(cat => {
      console.log(`- ${cat.name} (ID: ${cat._id})`);
    });

    // Get all products
    const products = await Product.find();
    console.log(`\nFound ${products.length} products:\n`);
    
    let productsWithCategory = 0;
    let productsWithoutCategory = 0;
    
    products.forEach(product => {
      if (product.categoryId) {
        productsWithCategory++;
        console.log(`✅ ${product.name} - categoryId: ${product.categoryId} (type: ${typeof product.categoryId})`);
      } else {
        productsWithoutCategory++;
        console.log(`❌ ${product.name} - NO categoryId`);
      }
    });

    console.log(`\n📊 Summary:`);
    console.log(`✅ Products with categoryId: ${productsWithCategory}`);
    console.log(`❌ Products without categoryId: ${productsWithoutCategory}`);

    // Check count for each category
    console.log(`\n📦 Product count by category:`);
    for (const category of categories) {
      const count = await Product.countDocuments({ 
        $or: [
          { categoryId: category._id.toString() },
          { categoryId: category._id }
        ]
      });
      console.log(`- ${category.name}: ${count} products`);
    }

    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkProductCategory();


