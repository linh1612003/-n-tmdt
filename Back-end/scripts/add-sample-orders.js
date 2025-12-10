// Script to add 20 successful orders and 10 pending orders
// Usage: node scripts/add-sample-orders.js

require('dotenv').config();
const mongoose = require('mongoose');

const shippingInfoSchema = new mongoose.Schema({
  receiver: String,
  phone: String,
  address: String,
  addressDetail: String,
}, { _id: false });

const productOrderSchema = new mongoose.Schema({
  productId: mongoose.Schema.Types.ObjectId,
  urlImage: String,
  quantity: Number,
  price: Number,
}, { _id: false });

const orderSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  products: [productOrderSchema],
  totalAmount: Number,
  orderDate: Date,
  shippingInfo: shippingInfoSchema,
  status: String,
  paymentStatus: String,
  shippingStatus: String,
  paymentMethod: String,
  isInCart: Boolean,
  vnpTxnRef: String,
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
const Product = mongoose.model('Product', new mongoose.Schema({}, { strict: false }));

const vietnameseNames = [
  'Nguyễn Văn An', 'Trần Thị Bình', 'Lê Văn Cường', 'Phạm Thị Dung', 'Hoàng Văn Đức',
  'Vũ Thị Em', 'Đặng Văn Phong', 'Bùi Thị Hoa', 'Đỗ Văn Hùng', 'Ngô Thị Lan',
  'Phan Văn Minh', 'Võ Thị Nga', 'Lý Văn Quang', 'Đinh Thị Phương', 'Trương Văn Sơn',
  'Lương Thị Tuyết', 'Hồ Văn Tuấn', 'Chu Thị Uyên', 'Dương Văn Việt', 'Lâm Thị Yến',
  'Vương Văn Bảo', 'Tạ Thị Cẩm', 'Đào Văn Dũng', 'Lưu Thị Giang', 'Mai Văn Hải',
  'Tô Thị Hương', 'Võ Văn Khánh', 'Lê Thị Linh', 'Nguyễn Văn Mạnh', 'Trần Thị Nhung'
];

const addresses = [
  'Quận 1, TP. Hồ Chí Minh',
  'Quận 3, TP. Hồ Chí Minh',
  'Quận 7, TP. Hồ Chí Minh',
  'Quận Bình Thạnh, TP. Hồ Chí Minh',
  'Quận Tân Bình, TP. Hồ Chí Minh',
  'Quận Gò Vấp, TP. Hồ Chí Minh',
  'Quận Phú Nhuận, TP. Hồ Chí Minh',
  'Quận 10, TP. Hồ Chí Minh',
  'Quận 11, TP. Hồ Chí Minh',
  'Quận 12, TP. Hồ Chí Minh',
  'Quận Cầu Giấy, Hà Nội',
  'Quận Ba Đình, Hà Nội',
  'Quận Hoàn Kiếm, Hà Nội',
  'Quận Hai Bà Trưng, Hà Nội',
  'Quận Đống Đa, Hà Nội',
  'Quận Thanh Xuân, Hà Nội',
  'Quận Long Biên, Hà Nội',
  'Quận Nam Từ Liêm, Hà Nội',
  'Quận Bắc Từ Liêm, Hà Nội',
  'Quận Tây Hồ, Hà Nội'
];

const addressDetails = [
  '123 Đường Nguyễn Huệ',
  '456 Đường Lê Lợi',
  '789 Đường Trần Hưng Đạo',
  '321 Đường Nguyễn Trãi',
  '654 Đường Lý Thường Kiệt',
  '987 Đường Hoàng Diệu',
  '147 Đường Võ Văn Tần',
  '258 Đường Điện Biên Phủ',
  '369 Đường Cách Mạng Tháng 8',
  '741 Đường Nguyễn Thị Minh Khai',
  '852 Đường Pasteur',
  '963 Đường Nam Kỳ Khởi Nghĩa',
  '159 Đường Đinh Tiên Hoàng',
  '357 Đường Lê Duẩn',
  '468 Đường Nguyễn Đình Chiểu',
  '579 Đường Võ Thị Sáu',
  '680 Đường Hai Bà Trưng',
  '791 Đường Lê Văn Việt',
  '802 Đường Nguyễn Văn Linh',
  '913 Đường Phạm Văn Đồng'
];

const phones = [
  '0901234567', '0912345678', '0923456789', '0934567890', '0945678901',
  '0956789012', '0967890123', '0978901234', '0989012345', '0990123456',
  '0909876543', '0918765432', '0927654321', '0936543210', '0945432109',
  '0954321098', '0963210987', '0972109876', '0981098765', '0990987654',
  '0901111111', '0912222222', '0923333333', '0934444444', '0945555555',
  '0956666666', '0967777777', '0978888888', '0989999999', '0990000000'
];

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomDate(startDaysAgo = 0, endDaysAgo = 30) {
  const now = new Date();
  const start = new Date(now);
  start.setDate(start.getDate() - endDaysAgo);
  const end = new Date(now);
  end.setDate(end.getDate() - startDaysAgo);
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function addSampleOrders() {
  try {
    if (!process.env.MONGO_CONNECTION_STRING) {
      console.error('❌ MONGO_CONNECTION_STRING not found in .env file');
      process.exit(1);
    }
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_CONNECTION_STRING.trim());
    console.log('✅ Connected to MongoDB\n');

    // Get all member users
    const users = await User.find({ role: 'member' }).limit(30);
    if (users.length === 0) {
      console.log('❌ No member users found. Please create some users first.');
      await mongoose.disconnect();
      process.exit(1);
    }

    // Get all products
    const products = await Product.find().limit(50);
    if (products.length === 0) {
      console.log('❌ No products found. Please create some products first.');
      await mongoose.disconnect();
      process.exit(1);
    }

    console.log(`Found ${users.length} users and ${products.length} products\n`);

    let successCount = 0;
    let pendingCount = 0;

    // Create 20 successful orders
    console.log('Creating 20 successful orders...');
    for (let i = 0; i < 20; i++) {
      const user = users[i % users.length];
      const numProducts = Math.floor(Math.random() * 3) + 1; // 1-3 products
      const selectedProducts = [];
      let totalAmount = 0;

      for (let j = 0; j < numProducts; j++) {
        const product = getRandomElement(products);
        const quantity = Math.floor(Math.random() * 3) + 1; // 1-3 quantity
        const price = product.salePrice || product.originalPrice || 1000000;
        totalAmount += price * quantity;

        selectedProducts.push({
          productId: product._id,
          urlImage: product.images && product.images.length > 0 ? product.images[0] : '',
          quantity: quantity,
          price: price,
        });
      }

      const order = {
        userId: user._id,
        products: selectedProducts,
        totalAmount: totalAmount,
        orderDate: getRandomDate(1, 30), // Orders from 1-30 days ago
        shippingInfo: {
          receiver: vietnameseNames[i],
          phone: phones[i],
          address: addresses[i % addresses.length],
          addressDetail: addressDetails[i % addressDetails.length],
        },
        status: 'success',
        paymentStatus: 'Đã thanh toán',
        shippingStatus: 'đã giao hàng',
        paymentMethod: Math.random() > 0.5 ? 'vnpay' : 'cash',
        isInCart: false,
      };

      await Order.create(order);
      successCount++;
      console.log(`✅ Created successful order ${i + 1}/20 - Total: ${totalAmount.toLocaleString('vi-VN')} VND`);
    }

    console.log('\nCreating 10 pending orders...');
    // Create 10 pending orders
    for (let i = 0; i < 10; i++) {
      const user = users[(i + 20) % users.length];
      const numProducts = Math.floor(Math.random() * 3) + 1; // 1-3 products
      const selectedProducts = [];
      let totalAmount = 0;

      for (let j = 0; j < numProducts; j++) {
        const product = getRandomElement(products);
        const quantity = Math.floor(Math.random() * 3) + 1; // 1-3 quantity
        const price = product.salePrice || product.originalPrice || 1000000;
        totalAmount += price * quantity;

        selectedProducts.push({
          productId: product._id,
          urlImage: product.images && product.images.length > 0 ? product.images[0] : '',
          quantity: quantity,
          price: price,
        });
      }

      const shippingStatuses = ['Chờ xử lý', 'Đang vận chuyển'];
      const paymentStatuses = ['pending', 'Thanh toán khi nhận hàng'];

      const order = {
        userId: user._id,
        products: selectedProducts,
        totalAmount: totalAmount,
        orderDate: getRandomDate(0, 7), // Recent orders from 0-7 days ago
        shippingInfo: {
          receiver: vietnameseNames[i + 20],
          phone: phones[i + 20],
          address: addresses[(i + 20) % addresses.length],
          addressDetail: addressDetails[(i + 20) % addressDetails.length],
        },
        status: 'pending',
        paymentStatus: getRandomElement(paymentStatuses),
        shippingStatus: getRandomElement(shippingStatuses),
        paymentMethod: Math.random() > 0.5 ? 'cash' : 'vnpay',
        isInCart: false,
      };

      await Order.create(order);
      pendingCount++;
      console.log(`✅ Created pending order ${i + 1}/10 - Total: ${totalAmount.toLocaleString('vi-VN')} VND`);
    }

    console.log(`\n📊 Summary:`);
    console.log(`✅ Successfully created: ${successCount} successful orders`);
    console.log(`⏳ Successfully created: ${pendingCount} pending orders`);
    console.log(`📦 Total: ${successCount + pendingCount} orders`);

    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addSampleOrders();

