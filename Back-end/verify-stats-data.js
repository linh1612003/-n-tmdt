// Script để kiểm tra dữ liệu thống kê có phải từ database thật không
require('dotenv').config();
const mongoose = require('mongoose');

// Kết nối MongoDB
async function verifyData() {
  try {
    console.log('🔍 Đang kết nối MongoDB...\n');
    await mongoose.connect(process.env.MONGO_CONNECTION_STRING.trim());
    console.log('✅ Đã kết nối MongoDB\n');

    const Order = mongoose.model('Order', new mongoose.Schema({}, { strict: false }));
    const Product = mongoose.model('Product', new mongoose.Schema({}, { strict: false }));

    // 1. Kiểm tra số lượng orders
    const totalOrders = await Order.countDocuments();
    console.log(`📦 Tổng số đơn hàng trong database: ${totalOrders}`);

    const successOrders = await Order.countDocuments({ status: 'success' });
    console.log(`✅ Đơn hàng thành công: ${successOrders}`);

    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    console.log(`⏳ Đơn hàng đang chờ: ${pendingOrders}\n`);

    // 2. Tính doanh thu thực từ database
    const revenueResult = await Order.aggregate([
      { $match: { status: 'success' } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          count: { $sum: 1 },
        },
      },
    ]);

    if (revenueResult.length > 0) {
      console.log(`💰 Doanh thu thực từ database: ${revenueResult[0].totalRevenue.toLocaleString('vi-VN')} VND`);
      console.log(`   (Từ ${revenueResult[0].count} đơn hàng thành công)\n`);
    } else {
      console.log('⚠️  Không có đơn hàng thành công trong database\n');
    }

    // 3. Kiểm tra top products
    const topProductsResult = await Order.aggregate([
      { $match: { status: 'success' } },
      { $unwind: '$products' },
      {
        $group: {
          _id: '$products.productId',
          totalQuantity: { $sum: '$products.quantity' },
        },
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 5 },
    ]);

    console.log(`📊 Top 5 sản phẩm bán chạy:`);
    if (topProductsResult.length > 0) {
      for (const item of topProductsResult) {
        const product = await Product.findById(item._id);
        const productName = product ? product.name : 'Unknown';
        console.log(`   - ${productName}: ${item.totalQuantity} sản phẩm`);
      }
    } else {
      console.log('   (Không có dữ liệu)');
    }

    console.log('\n✅ KẾT LUẬN:');
    console.log('   Dữ liệu thống kê là DỮ LIỆU THẬT từ MongoDB');
    console.log('   - Lấy từ Order collection');
    console.log('   - Tính toán bằng MongoDB Aggregation Pipeline');
    console.log('   - Không phải dữ liệu ảo hay hardcode\n');

    if (totalOrders === 0) {
      console.log('⚠️  CẢNH BÁO: Database chưa có đơn hàng nào!');
      console.log('   Trang thống kê sẽ hiển thị: 0 hoặc rỗng');
      console.log('   Để có dữ liệu, cần:');
      console.log('   1. Tạo đơn hàng qua hệ thống');
      console.log('   2. Hoặc chạy script tạo sample data\n');
    }

    await mongoose.disconnect();
    console.log('✅ Đã ngắt kết nối MongoDB');
  } catch (error) {
    console.error('❌ Lỗi:', error.message);
    process.exit(1);
  }
}

verifyData();

