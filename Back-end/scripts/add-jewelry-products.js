// Script to add 20 new jewelry products
// Usage: node scripts/add-jewelry-products.js

require('dotenv').config();
const mongoose = require('mongoose');
const axios = require('axios');

const productSchema = new mongoose.Schema({
  name: String,
  images: [String],
  description: String,
  descriptionFull: String,
  originalPrice: Number,
  salePrice: Number,
  material: String,
  weight: Number,
  size: String,
  gender: String,
  style: String,
  brand: String,
  origin: String,
  warranty: String,
  typeId: String,
  quantity: Number,
  importPrice: Number,
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

const jewelryProducts = [
  {
    name: "Nhẫn vàng 18K đính kim cương",
    description: "Nhẫn vàng 18K sang trọng với viên kim cương tinh tế",
    descriptionFull: "Nhẫn vàng 18K được chế tác thủ công, đính viên kim cương tự nhiên 0.5 carat. Thiết kế tinh tế, phù hợp cho cả nam và nữ. Bảo hành 2 năm.",
    originalPrice: 15000000,
    salePrice: 12900000,
    material: "Vàng 18K",
    weight: 3.5,
    size: "Size 16",
    gender: "Unisex",
    style: "Cổ điển",
    brand: "Hanie Jewelry",
    origin: "Việt Nam",
    warranty: "2 năm",
    typeId: "ring",
    quantity: 10,
    importPrice: 10000000,
    images: ["https://via.placeholder.com/500?text=Nhan+Vang+18K"]
  },
  {
    name: "Dây chuyền bạc 925 đính đá quý",
    description: "Dây chuyền bạc 925 cao cấp với đá quý tự nhiên",
    descriptionFull: "Dây chuyền bạc 925 được thiết kế hiện đại, đính đá quý tự nhiên. Chiều dài 45cm, có thể điều chỉnh. Phù hợp cho mọi dịp.",
    originalPrice: 2500000,
    salePrice: 1990000,
    material: "Bạc 925",
    weight: 8.2,
    size: "45cm",
    gender: "Nữ",
    style: "Hiện đại",
    brand: "Hanie Jewelry",
    origin: "Việt Nam",
    warranty: "1 năm",
    typeId: "necklace",
    quantity: 15,
    importPrice: 1500000,
    images: ["https://via.placeholder.com/500?text=Day+Chuyen+Bac"]
  },
  {
    name: "Vòng tay vàng 14K đơn giản",
    description: "Vòng tay vàng 14K thiết kế đơn giản, thanh lịch",
    descriptionFull: "Vòng tay vàng 14K với thiết kế tối giản, phù hợp mọi phong cách. Độ dày 3mm, có thể điều chỉnh kích thước.",
    originalPrice: 8000000,
    salePrice: 6990000,
    material: "Vàng 14K",
    weight: 5.8,
    size: "17-19cm",
    gender: "Unisex",
    style: "Tối giản",
    brand: "Hanie Jewelry",
    origin: "Việt Nam",
    warranty: "2 năm",
    typeId: "bracelet",
    quantity: 12,
    importPrice: 5500000,
    images: ["https://via.placeholder.com/500?text=Vong+Tay+Vang"]
  },
  {
    name: "Bông tai bạc 925 hình hoa",
    description: "Bông tai bạc 925 thiết kế hình hoa tinh tế",
    descriptionFull: "Bông tai bạc 925 được chế tác tinh xảo với thiết kế hình hoa. Phù hợp cho các dịp đặc biệt. Trọng lượng nhẹ, không gây khó chịu.",
    originalPrice: 1200000,
    salePrice: 990000,
    material: "Bạc 925",
    weight: 2.5,
    size: "2.5cm",
    gender: "Nữ",
    style: "Nữ tính",
    brand: "Hanie Jewelry",
    origin: "Việt Nam",
    warranty: "1 năm",
    typeId: "earring",
    quantity: 20,
    importPrice: 700000,
    images: ["https://via.placeholder.com/500?text=Bong+Tai+Hoa"]
  },
  {
    name: "Lắc chân bạc 925 có chuông",
    description: "Lắc chân bạc 925 có chuông nhỏ xinh xắn",
    descriptionFull: "Lắc chân bạc 925 với chuông nhỏ tạo âm thanh dễ thương. Thiết kế bo tròn, an toàn khi sử dụng. Phù hợp cho mọi lứa tuổi.",
    originalPrice: 1500000,
    salePrice: 1190000,
    material: "Bạc 925",
    weight: 4.2,
    size: "18-22cm",
    gender: "Nữ",
    style: "Trẻ trung",
    brand: "Hanie Jewelry",
    origin: "Việt Nam",
    warranty: "1 năm",
    typeId: "anklet",
    quantity: 18,
    importPrice: 800000,
    images: ["https://via.placeholder.com/500?text=Lac+Chan"]
  },
  {
    name: "Nhẫn cưới vàng trắng 18K",
    description: "Nhẫn cưới vàng trắng 18K thiết kế cổ điển",
    descriptionFull: "Nhẫn cưới vàng trắng 18K với thiết kế cổ điển, vĩnh cửu. Bề mặt được đánh bóng kỹ lưỡng. Có thể khắc tên theo yêu cầu.",
    originalPrice: 12000000,
    salePrice: 10900000,
    material: "Vàng trắng 18K",
    weight: 4.2,
    size: "Size 15-18",
    gender: "Unisex",
    style: "Cổ điển",
    brand: "Hanie Jewelry",
    origin: "Việt Nam",
    warranty: "Trọn đời",
    typeId: "ring",
    quantity: 8,
    importPrice: 8500000,
    images: ["https://via.placeholder.com/500?text=Nhan+Cuoi"]
  },
  {
    name: "Dây chuyền vàng 18K có mặt dây",
    description: "Dây chuyền vàng 18K với mặt dây đá quý",
    descriptionFull: "Dây chuyền vàng 18K kết hợp mặt dây đá quý tự nhiên. Thiết kế sang trọng, phù hợp các dịp quan trọng. Chiều dài 50cm.",
    originalPrice: 18000000,
    salePrice: 15900000,
    material: "Vàng 18K",
    weight: 12.5,
    size: "50cm",
    gender: "Nữ",
    style: "Sang trọng",
    brand: "Hanie Jewelry",
    origin: "Việt Nam",
    warranty: "2 năm",
    typeId: "necklace",
    quantity: 6,
    importPrice: 12000000,
    images: ["https://via.placeholder.com/500?text=Day+Chuyen+Mat+Day"]
  },
  {
    name: "Vòng tay đá thạch anh hồng",
    description: "Vòng tay đá thạch anh hồng tự nhiên",
    descriptionFull: "Vòng tay được làm từ đá thạch anh hồng tự nhiên, mỗi viên đá được chọn lọc kỹ càng. Có tác dụng tốt cho sức khỏe. Kích thước có thể điều chỉnh.",
    originalPrice: 3500000,
    salePrice: 2990000,
    material: "Đá thạch anh hồng",
    weight: 15.8,
    size: "16-20cm",
    gender: "Nữ",
    style: "Tự nhiên",
    brand: "Hanie Jewelry",
    origin: "Việt Nam",
    warranty: "6 tháng",
    typeId: "bracelet",
    quantity: 25,
    importPrice: 2000000,
    images: ["https://via.placeholder.com/500?text=Vong+Tay+Da"]
  },
  {
    name: "Bông tai vàng 14K giọt nước",
    description: "Bông tai vàng 14K thiết kế giọt nước",
    descriptionFull: "Bông tai vàng 14K với thiết kế giọt nước thanh lịch. Phù hợp cho công sở và các dịp đặc biệt. Trọng lượng vừa phải, không gây đau tai.",
    originalPrice: 4500000,
    salePrice: 3990000,
    material: "Vàng 14K",
    weight: 3.2,
    size: "3cm",
    gender: "Nữ",
    style: "Thanh lịch",
    brand: "Hanie Jewelry",
    origin: "Việt Nam",
    warranty: "2 năm",
    typeId: "earring",
    quantity: 14,
    importPrice: 3000000,
    images: ["https://via.placeholder.com/500?text=Bong+Tai+Giot+Nuoc"]
  },
  {
    name: "Lắc chân vàng 14K mảnh",
    description: "Lắc chân vàng 14K thiết kế mảnh mai",
    descriptionFull: "Lắc chân vàng 14K với thiết kế mảnh mai, tinh tế. Phù hợp cho mùa hè, tạo điểm nhấn cho đôi chân. Có thể điều chỉnh kích thước.",
    originalPrice: 3500000,
    salePrice: 2990000,
    material: "Vàng 14K",
    weight: 2.8,
    size: "19-23cm",
    gender: "Nữ",
    style: "Tinh tế",
    brand: "Hanie Jewelry",
    origin: "Việt Nam",
    warranty: "1 năm",
    typeId: "anklet",
    quantity: 16,
    importPrice: 2200000,
    images: ["https://via.placeholder.com/500?text=Lac+Chan+Manh"]
  },
  {
    name: "Nhẫn nam vàng 18K khối",
    description: "Nhẫn nam vàng 18K thiết kế khối mạnh mẽ",
    descriptionFull: "Nhẫn nam vàng 18K với thiết kế khối mạnh mẽ, phù hợp phong cách nam tính. Bề mặt được đánh bóng và mài cạnh sắc nét.",
    originalPrice: 10000000,
    salePrice: 8990000,
    material: "Vàng 18K",
    weight: 6.5,
    size: "Size 18-22",
    gender: "Nam",
    style: "Nam tính",
    brand: "Hanie Jewelry",
    origin: "Việt Nam",
    warranty: "2 năm",
    typeId: "ring",
    quantity: 10,
    importPrice: 7000000,
    images: ["https://via.placeholder.com/500?text=Nhan+Nam"]
  },
  {
    name: "Dây chuyền bạc 925 có charm",
    description: "Dây chuyền bạc 925 với charm hình trái tim",
    descriptionFull: "Dây chuyền bạc 925 với charm hình trái tim tinh tế. Thiết kế trẻ trung, phù hợp cho giới trẻ. Chiều dài 42cm, có thể điều chỉnh.",
    originalPrice: 1800000,
    salePrice: 1490000,
    material: "Bạc 925",
    weight: 6.8,
    size: "42cm",
    gender: "Nữ",
    style: "Trẻ trung",
    brand: "Hanie Jewelry",
    origin: "Việt Nam",
    warranty: "1 năm",
    typeId: "necklace",
    quantity: 22,
    importPrice: 1000000,
    images: ["https://via.placeholder.com/500?text=Day+Chuyen+Charm"]
  },
  {
    name: "Vòng tay bạc 925 đính đá",
    description: "Vòng tay bạc 925 đính đá cubic zirconia",
    descriptionFull: "Vòng tay bạc 925 đính đá cubic zirconia lấp lánh. Thiết kế hiện đại, phù hợp mọi trang phục. Có thể điều chỉnh kích thước.",
    originalPrice: 2200000,
    salePrice: 1890000,
    material: "Bạc 925, đá CZ",
    weight: 7.5,
    size: "16-19cm",
    gender: "Nữ",
    style: "Hiện đại",
    brand: "Hanie Jewelry",
    origin: "Việt Nam",
    warranty: "1 năm",
    typeId: "bracelet",
    quantity: 18,
    importPrice: 1300000,
    images: ["https://via.placeholder.com/500?text=Vong+Tay+Dinh+Da"]
  },
  {
    name: "Bông tai bạc 925 hình ngôi sao",
    description: "Bông tai bạc 925 thiết kế hình ngôi sao",
    descriptionFull: "Bông tai bạc 925 với thiết kế hình ngôi sao độc đáo. Phù hợp cho các bạn trẻ yêu thích phong cách cá tính. Trọng lượng nhẹ.",
    originalPrice: 950000,
    salePrice: 799000,
    material: "Bạc 925",
    weight: 2.1,
    size: "2cm",
    gender: "Nữ",
    style: "Cá tính",
    brand: "Hanie Jewelry",
    origin: "Việt Nam",
    warranty: "1 năm",
    typeId: "earring",
    quantity: 25,
    importPrice: 500000,
    images: ["https://via.placeholder.com/500?text=Bong+Tai+Ngoi+Sao"]
  },
  {
    name: "Lắc chân bạc 925 có charm",
    description: "Lắc chân bạc 925 với charm hình trái tim",
    descriptionFull: "Lắc chân bạc 925 với charm hình trái tim xinh xắn. Thiết kế nữ tính, phù hợp cho mùa hè. Có thể điều chỉnh kích thước.",
    originalPrice: 1300000,
    salePrice: 1090000,
    material: "Bạc 925",
    weight: 3.9,
    size: "18-22cm",
    gender: "Nữ",
    style: "Nữ tính",
    brand: "Hanie Jewelry",
    origin: "Việt Nam",
    warranty: "1 năm",
    typeId: "anklet",
    quantity: 20,
    importPrice: 700000,
    images: ["https://via.placeholder.com/500?text=Lac+Chan+Charm"]
  },
  {
    name: "Nhẫn vàng 18K đính ngọc trai",
    description: "Nhẫn vàng 18K đính ngọc trai tự nhiên",
    descriptionFull: "Nhẫn vàng 18K đính ngọc trai tự nhiên cao cấp. Thiết kế tinh tế, phù hợp cho các dịp đặc biệt. Ngọc trai được chọn lọc kỹ càng.",
    originalPrice: 14000000,
    salePrice: 12900000,
    material: "Vàng 18K, ngọc trai",
    weight: 4.8,
    size: "Size 16-18",
    gender: "Nữ",
    style: "Cổ điển",
    brand: "Hanie Jewelry",
    origin: "Việt Nam",
    warranty: "2 năm",
    typeId: "ring",
    quantity: 7,
    importPrice: 9500000,
    images: ["https://via.placeholder.com/500?text=Nhan+Ngoc+Trai"]
  },
  {
    name: "Dây chuyền vàng 14K đơn giản",
    description: "Dây chuyền vàng 14K thiết kế đơn giản",
    descriptionFull: "Dây chuyền vàng 14K với thiết kế tối giản, thanh lịch. Phù hợp mọi dịp, dễ phối đồ. Chiều dài 45cm, có thể điều chỉnh.",
    originalPrice: 12000000,
    salePrice: 10900000,
    material: "Vàng 14K",
    weight: 10.2,
    size: "45cm",
    gender: "Unisex",
    style: "Tối giản",
    brand: "Hanie Jewelry",
    origin: "Việt Nam",
    warranty: "2 năm",
    typeId: "necklace",
    quantity: 9,
    importPrice: 8500000,
    images: ["https://via.placeholder.com/500?text=Day+Chuyen+Don+Gian"]
  },
  {
    name: "Vòng tay vàng 18K đính đá",
    description: "Vòng tay vàng 18K đính đá quý",
    descriptionFull: "Vòng tay vàng 18K đính đá quý tự nhiên. Thiết kế sang trọng, phù hợp các dịp quan trọng. Có thể điều chỉnh kích thước.",
    originalPrice: 22000000,
    salePrice: 19900000,
    material: "Vàng 18K, đá quý",
    weight: 14.5,
    size: "17-20cm",
    gender: "Nữ",
    style: "Sang trọng",
    brand: "Hanie Jewelry",
    origin: "Việt Nam",
    warranty: "2 năm",
    typeId: "bracelet",
    quantity: 5,
    importPrice: 15000000,
    images: ["https://via.placeholder.com/500?text=Vong+Tay+Dinh+Da+Quy"]
  },
  {
    name: "Bông tai vàng 18K hoa mai",
    description: "Bông tai vàng 18K thiết kế hoa mai",
    descriptionFull: "Bông tai vàng 18K với thiết kế hoa mai tinh xảo. Mang đậm nét văn hóa Việt Nam. Phù hợp cho các dịp lễ tết, cưới hỏi.",
    originalPrice: 8500000,
    salePrice: 7490000,
    material: "Vàng 18K",
    weight: 4.5,
    size: "3.5cm",
    gender: "Nữ",
    style: "Truyền thống",
    brand: "Hanie Jewelry",
    origin: "Việt Nam",
    warranty: "2 năm",
    typeId: "earring",
    quantity: 11,
    importPrice: 6000000,
    images: ["https://via.placeholder.com/500?text=Bong+Tai+Hoa+Mai"]
  },
  {
    name: "Lắc chân vàng 18K có charm",
    description: "Lắc chân vàng 18K với charm hình bướm",
    descriptionFull: "Lắc chân vàng 18K với charm hình bướm tinh tế. Thiết kế độc đáo, tạo điểm nhấn cho đôi chân. Có thể điều chỉnh kích thước.",
    originalPrice: 5500000,
    salePrice: 4990000,
    material: "Vàng 18K",
    weight: 3.5,
    size: "19-23cm",
    gender: "Nữ",
    style: "Độc đáo",
    brand: "Hanie Jewelry",
    origin: "Việt Nam",
    warranty: "2 năm",
    typeId: "anklet",
    quantity: 13,
    importPrice: 3800000,
    images: ["https://via.placeholder.com/500?text=Lac+Chan+Butom"]
  }
];

async function addJewelryProducts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_CONNECTION_STRING);
    console.log('✅ Connected to MongoDB\n');

    let successCount = 0;
    let errorCount = 0;

    for (const product of jewelryProducts) {
      try {
        // Check if product already exists
        const existingProduct = await Product.findOne({ name: product.name });
        if (existingProduct) {
          console.log(`⚠️  Product "${product.name}" already exists, skipping...`);
          continue;
        }

        // Create new product
        const newProduct = await Product.create(product);
        console.log(`✅ Created: ${product.name}`);
        successCount++;
      } catch (error) {
        console.error(`❌ Error creating "${product.name}":`, error.message);
        errorCount++;
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`✅ Successfully created: ${successCount} products`);
    console.log(`❌ Errors: ${errorCount} products`);

    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addJewelryProducts();


