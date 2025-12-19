import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from '../../order/schema/order.shema';
import { Product } from '../../product/schema/product.shema';

@Injectable()
export class AdminStatsService {
  constructor(
    @InjectModel(Order.name)
    private orderModel: Model<Order>,
    @InjectModel(Product.name)
    private productModel: Model<Product>,
  ) {}

  /**
   * Lấy thống kê tổng hợp cho Admin Dashboard
   * @param startDate Ngày bắt đầu (ISO string)
   * @param endDate Ngày kết thúc (ISO string)
   */
  async getAdminStats(startDate?: string, endDate?: string) {
    // Xử lý date range - nếu không có thì lấy tất cả
    let dateFilter: any = {};
    if (startDate && endDate) {
      try {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        dateFilter = {
          orderDate: {
            $gte: start,
            $lte: end,
          },
        };
      } catch (error) {
        console.error('Error parsing dates:', error);
        // Nếu parse lỗi, không filter theo date
        dateFilter = {};
      }
    }

    try {
      // 1. Tính KPIs: Doanh thu tạm tính, Doanh thu thực, Lợi nhuận ròng, Tỷ lệ
      const kpis = await this.calculateKPIs(dateFilter);

      // 2. Biểu đồ đường: Doanh thu theo thời gian (nhóm theo Ngày/Tháng)
      const revenueByTime = await this.getRevenueByTime(dateFilter);

      // 3. Top 10 sản phẩm có số lượng bán ra cao nhất
      const topProducts = await this.getTopProducts(dateFilter);

      // 4. Biểu đồ Donut: Tỷ lệ trạng thái đơn hàng
      const orderStatusStats = await this.getOrderStatusStats(dateFilter);

      // Đảm bảo luôn trả về dữ liệu hợp lệ, ngay cả khi không có dữ liệu
      return {
        kpis: kpis || {
          estimatedRevenue: 0,
          actualRevenue: 0,
          netProfit: 0,
          profitRate: 0,
        },
        revenueByTime: revenueByTime || [],
        topProducts: topProducts || [],
        orderStatusStats: orderStatusStats || [],
      };
    } catch (error) {
      console.error('Error in getAdminStats:', error);
      // Trả về dữ liệu rỗng nếu có lỗi
      return {
        kpis: {
          estimatedRevenue: 0,
          actualRevenue: 0,
          netProfit: 0,
          profitRate: 0,
        },
        revenueByTime: [],
        topProducts: [],
        orderStatusStats: [],
      };
    }
  }

  /**
   * Tính các KPIs: Doanh thu tạm tính, Doanh thu thực, Lợi nhuận ròng, Tỷ lệ
   */
  private async calculateKPIs(dateFilter: any) {
    // Doanh thu tạm tính: Tổng tất cả đơn hàng (cả pending và success)
    // Nếu dateFilter rỗng {}, lấy tất cả orders
    const matchFilter = Object.keys(dateFilter).length > 0 ? dateFilter : {};
    const totalEstimatedRevenue = await this.orderModel.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' },
        },
      },
    ]);

    // Doanh thu thực: Chỉ đơn hàng thành công (status: 'success')
    const successFilter = Object.keys(dateFilter).length > 0 
      ? { ...dateFilter, status: 'success' }
      : { status: 'success' };
    
    const totalActualRevenue = await this.orderModel.aggregate([
      { $match: successFilter },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' },
        },
      },
    ]);

    // Tính giá vốn và lợi nhuận từ các đơn thành công
    const orders = await this.orderModel.find(successFilter).lean();

    let totalCost = 0;
    let actualRevenue = 0;

    orders.forEach((order: any) => {
      actualRevenue += order.totalAmount || 0;

      if (order.products && Array.isArray(order.products)) {
        order.products.forEach((product: any) => {
          const importPrice = product.importPrice || 0;
          const quantity = product.quantity || 0;
          totalCost += importPrice * quantity;
        });
      }
    });

    // Nếu không có importPrice trong products, tính giá vốn = 70% doanh thu
    // Lợi nhuận ròng = 30% doanh thu thực
    // TODO: Cần đảm bảo importPrice được lưu trong order.products khi tạo đơn
    // Hiện tại OrderService đã lưu importPrice vào products, nhưng nếu dữ liệu cũ không có thì dùng công thức này
    if (totalCost === 0 && actualRevenue > 0) {
      totalCost = actualRevenue * 0.7; // Giả định giá vốn = 70% doanh thu, lợi nhuận = 30%
    }

    const netProfit = actualRevenue - totalCost;
    const profitRate = actualRevenue > 0 ? (netProfit / actualRevenue) * 100 : 0;

    return {
      estimatedRevenue: totalEstimatedRevenue[0]?.total || 0,
      actualRevenue: totalActualRevenue[0]?.total || 0,
      netProfit: netProfit,
      profitRate: profitRate,
    };
  }

  /**
   * Lấy doanh thu theo thời gian (nhóm theo Ngày/Tháng)
   */
  private async getRevenueByTime(dateFilter: any) {
    const matchFilter = Object.keys(dateFilter).length > 0
      ? { ...dateFilter, status: 'success' }
      : { status: 'success' };
    
    const pipeline: any[] = [
      { $match: matchFilter },
      {
        $group: {
          _id: {
            year: { $year: '$orderDate' },
            month: { $month: '$orderDate' },
            day: { $dayOfMonth: '$orderDate' },
          },
          revenue: { $sum: '$totalAmount' },
          date: { $first: '$orderDate' },
        },
      },
      { $sort: { '_id.year': 1 as const, '_id.month': 1 as const, '_id.day': 1 as const } },
      {
        $project: {
          _id: 0,
          date: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$date',
            },
          },
          revenue: 1,
          year: '$_id.year',
          month: '$_id.month',
          day: '$_id.day',
        },
      },
    ];

    const result = await this.orderModel.aggregate(pipeline);

    // Format lại để hiển thị theo định dạng "Thg6 2025"
    return result.map((item) => {
      const date = new Date(item.date);
      const monthNames = [
        'Thg1', 'Thg2', 'Thg3', 'Thg4', 'Thg5', 'Thg6',
        'Thg7', 'Thg8', 'Thg9', 'Thg10', 'Thg11', 'Thg12',
      ];
      // Hiển thị theo tháng và năm
      const displayDate = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
      return {
        date: item.date,
        displayDate: displayDate,
        revenue: item.revenue,
        year: item.year,
        month: item.month,
        day: item.day,
      };
    });
  }

  /**
   * Lấy Top 10 sản phẩm có số lượng bán ra cao nhất
   */
  private async getTopProducts(dateFilter: any) {
    const matchFilter = Object.keys(dateFilter).length > 0
      ? { ...dateFilter, status: 'success' }
      : { status: 'success' };
    
    const pipeline: any[] = [
      { $match: matchFilter },
      { $unwind: '$products' },
      {
        $group: {
          _id: '$products.productId',
          totalQuantity: { $sum: '$products.quantity' },
        },
      },
      { $sort: { totalQuantity: -1 as const } },
      { $limit: 10 },
    ];

    const result = await this.orderModel.aggregate(pipeline);

    // Lấy thông tin sản phẩm
    if (result.length === 0) {
      return [];
    }

    const productIds = result.map((item) => {
      // Xử lý cả ObjectId và string
      if (item._id && typeof item._id === 'object') {
        return item._id.toString();
      }
      return item._id;
    }).filter(Boolean);

    if (productIds.length === 0) {
      return [];
    }

    try {
      const products = await this.productModel.find({
        _id: { $in: productIds },
      }).lean();

      const productMap = new Map(
        products.map((p: any) => [p._id.toString(), p.name]),
      );

      return result.map((item) => {
        const productId = item._id?.toString() || item._id;
        return {
          productId: productId,
          productName: productMap.get(productId) || 'Unknown',
          quantity: item.totalQuantity,
        };
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      // Trả về với productId thay vì name nếu lỗi
      return result.map((item) => ({
        productId: item._id?.toString() || item._id,
        productName: 'Unknown',
        quantity: item.totalQuantity,
      }));
    }
  }

  /**
   * Lấy thống kê trạng thái đơn hàng
   */
  private async getOrderStatusStats(dateFilter: any) {
    const matchFilter = Object.keys(dateFilter).length > 0 ? dateFilter : {};
    const pipeline = [
      { $match: matchFilter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ];

    const result = await this.orderModel.aggregate(pipeline);

    const total = result.reduce((sum, item) => sum + item.count, 0);

    return result.map((item) => ({
      status: item._id,
      count: item.count,
      percentage: total > 0 ? (item.count / total) * 100 : 0,
    }));
  }
}

