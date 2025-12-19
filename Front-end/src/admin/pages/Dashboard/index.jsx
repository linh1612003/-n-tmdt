<<<<<<< HEAD
import { Layout } from 'antd';
import React from 'react';
import Overview from '../Dashboard/components/Overview';
import SalePercent from '../Dashboard/components/SalePercent';
import TimeLine from '../Dashboard/components/TimeLine';


const Dashboard = () => {
    return (
        <div style={{  }}>
            <Overview />
            <SalePercent />
            <TimeLine />
        </div>
    );
};

export default Dashboard;
=======
import React, { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, Spin, DatePicker, message } from 'antd';
import dayjs from 'dayjs';
import adminApi from '../../../api/adminApi';
import './Dashboard.css';

const { RangePicker } = DatePicker;

const COLORS = {
  green: '#22c55e',
  pink: '#db2777',
  blue: '#1d4ed8',
  yellow: '#eab308',
};

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [dateRange, setDateRange] = useState([
    dayjs().subtract(6, 'month'),
    dayjs(),
  ]);

  useEffect(() => {
    fetchStats();
  }, [dateRange]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const startDate = dateRange[0]?.format('YYYY-MM-DD');
      const endDate = dateRange[1]?.format('YYYY-MM-DD');
      console.log('Fetching stats with dates:', { startDate, endDate });
      const data = await adminApi.getStats(startDate, endDate);
      console.log('Stats data received:', data);
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      console.error('Error details:', error.response?.data || error.message);
      const errorMsg = error.response?.data?.message || error.message || 'Không thể tải dữ liệu thống kê';
      message.error(`Lỗi: ${errorMsg}`);
      // Set empty stats để tránh crash
      setStats({
        kpis: { estimatedRevenue: 0, actualRevenue: 0, netProfit: 0, profitRate: 0 },
        revenueByTime: [],
        topProducts: [],
        orderStatusStats: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (dates) => {
    if (dates && dates.length === 2) {
      setDateRange(dates);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value) => {
    const num = Number(value);
    if (isNaN(num)) return '0';
    
    if (num >= 1000000000) {
      // Format: 1.715,5 Tỷ
      const billions = num / 1000000000;
      return `${billions.toLocaleString('vi-VN', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} Tỷ`;
    } else if (num >= 1000000) {
      // Format: 1.715,5 M
      const millions = num / 1000000;
      return `${millions.toLocaleString('vi-VN', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} M`;
    } else if (num >= 1000) {
      const thousands = num / 1000;
      return `${thousands.toLocaleString('vi-VN', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} K`;
    }
    return num.toLocaleString('vi-VN', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!stats) {
    return <div>Không có dữ liệu</div>;
  }

  const { kpis, revenueByTime, topProducts, orderStatusStats } = stats;

  // Format KPIs
  const estimatedRevenue = formatNumber(kpis.estimatedRevenue);
  const actualRevenue = formatNumber(kpis.actualRevenue);
  const netProfit = formatNumber(kpis.netProfit);
  const profitRate = `${Number(kpis.profitRate).toFixed(2)}%`;

  // Format revenue chart data (convert to tỷ)
  const revenueChartData = revenueByTime.map((item) => ({
    date: item.displayDate,
    revenue: item.revenue / 1000000000, // Convert to tỷ
    fullDate: item.date,
  }));

  // Format top products
  const topProductsData = topProducts.map((item) => ({
    name: item.productName.length > 20 
      ? item.productName.substring(0, 20) + '...' 
      : item.productName,
    quantity: item.quantity,
  }));

  // Format order status for donut chart
  const orderStatusData = orderStatusStats.map((item) => ({
    name: item.status === 'success' ? 'Thành công' : 'Đang chờ',
    value: item.count,
    percentage: item.percentage,
  }));

  return (
    <div className="admin-dashboard" style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header với Date Picker */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'monospace', fontSize: '24px', margin: 0 }}>Admin Dashboard</h1>
        <RangePicker
          value={dateRange}
          onChange={handleDateChange}
          format="DD/MM/YYYY"
          placeholder={['Từ ngày', 'Đến ngày']}
        />
      </div>

      {/* KPIs Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <Card className="kpi-card">
          <div className="kpi-label">Doanh thu tạm tính</div>
          <div className="kpi-value">{estimatedRevenue}</div>
        </Card>
        <Card className="kpi-card">
          <div className="kpi-label">Doanh thu thực</div>
          <div className="kpi-value">{actualRevenue}</div>
        </Card>
        <Card className="kpi-card">
          <div className="kpi-label">Lợi Nhuận Ròng</div>
          <div className="kpi-value">{netProfit}</div>
        </Card>
        <Card className="kpi-card">
          <div className="kpi-label">Tỷ lệ</div>
          <div className="kpi-value">{profitRate}</div>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card title="Doanh thu theo Year, Quarter, Month và Day" style={{ marginBottom: '24px' }}>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={revenueChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis label={{ value: 'Doanh thu (tỷ)', angle: -90, position: 'insideLeft' }} />
            <Tooltip 
              formatter={(value) => [`${Number(value).toLocaleString('vi-VN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} tỷ`, 'Doanh thu']}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke={COLORS.green}
              fill={COLORS.green}
              fillOpacity={0.6}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Bottom Charts: Products and Order Status */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Top Products Bar Chart */}
        <Card title="Số lượng theo Tên sản phẩm">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={topProductsData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" label={{ value: 'Số lượng', position: 'insideBottom', offset: -5 }} />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip />
              <Bar dataKey="quantity" fill={COLORS.pink} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Order Status Donut Chart */}
        <Card title="số lượng đơn theo Trạng thái">
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={orderStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name}: ${percentage.toFixed(2)}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {orderStatusData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.name === 'Thành công' ? COLORS.blue : COLORS.yellow}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;

>>>>>>> origin/back-up
