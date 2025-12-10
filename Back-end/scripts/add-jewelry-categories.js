// Script to add jewelry categories
// Usage: node scripts/add-jewelry-categories.js

require('dotenv').config();
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: String,
  availabilityStatus: String,
  order: Number,
  menuId: mongoose.Schema.Types.ObjectId,
}, { timestamps: true });

const menuSchema = new mongoose.Schema({
  name: String,
  order: Number,
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);
const Menu = mongoose.model('Menu', menuSchema);

const jewelryCategories = [
  {
    name: 'Nhẫn',
    availabilityStatus: 'Product',
    order: 1,
  },
  {
    name: 'Dây chuyền',
    availabilityStatus: 'Product',
    order: 2,
  },
  {
    name: 'Vòng tay',
    availabilityStatus: 'Product',
    order: 3,
  },
  {
    name: 'Bông tai',
    availabilityStatus: 'Product',
    order: 4,
  },
  {
    name: 'Lắc chân',
    availabilityStatus: 'Product',
    order: 5,
  },
  {
    name: 'Trang sức vàng',
    availabilityStatus: 'Product',
    order: 6,
  },
  {
    name: 'Trang sức bạc',
    availabilityStatus: 'Product',
    order: 7,
  },
  {
    name: 'Trang sức đá quý',
    availabilityStatus: 'Product',
    order: 8,
  },
  {
    name: 'Sản phẩm mới',
    availabilityStatus: 'Product',
    order: 9,
  },
  {
    name: 'Khuyến mãi',
    availabilityStatus: 'Product',
    order: 10,
  },
];

async function addJewelryCategories() {
  try {
    if (!process.env.MONGO_CONNECTION_STRING) {
      console.error('❌ MONGO_CONNECTION_STRING not found in .env file');
      process.exit(1);
    }
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_CONNECTION_STRING.trim());
    console.log('✅ Connected to MongoDB\n');

    // Get or create menu
    let menu = await Menu.findOne({ name: 'Sản Phẩm' });
    if (!menu) {
      menu = await Menu.create({
        name: 'Sản Phẩm',
        order: 0,
      });
      console.log('✅ Created menu: Sản Phẩm');
    } else {
      console.log('✅ Found existing menu: Sản Phẩm');
    }

    let successCount = 0;
    let skipCount = 0;

    console.log('\nCreating categories...');
    for (const categoryData of jewelryCategories) {
      try {
        // Check if category already exists
        const existingCategory = await Category.findOne({ 
          name: categoryData.name,
          menuId: menu._id 
        });
        
        if (existingCategory) {
          console.log(`⚠️  Category "${categoryData.name}" already exists, skipping...`);
          skipCount++;
          continue;
        }

        // Create new category
        const newCategory = await Category.create({
          ...categoryData,
          menuId: menu._id,
        });
        console.log(`✅ Created: ${categoryData.name}`);
        successCount++;
      } catch (error) {
        console.error(`❌ Error creating "${categoryData.name}":`, error.message);
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`✅ Successfully created: ${successCount} categories`);
    console.log(`⚠️  Skipped (already exist): ${skipCount} categories`);

    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addJewelryCategories();

