import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class PowerBIService {
  private readonly powerBIApiUrl = 'https://api.powerbi.com/v1.0/myorg';
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null;

  // Cấu hình Power BI (cần thêm vào .env)
  private readonly clientId = process.env.POWERBI_CLIENT_ID || '';
  private readonly clientSecret = process.env.POWERBI_CLIENT_SECRET || '';
  private readonly tenantId = process.env.POWERBI_TENANT_ID || 'e7572e92-7aee-4713-a3c4-ba64888ad45f';
  private readonly reportId = process.env.POWERBI_REPORT_ID || '41d0d0e2-cd15-4a2d-939e-4b84911bb59b';

  /**
   * Authenticate với Power BI và lấy access token
   */
  private async authenticate(): Promise<string> {
    // Kiểm tra token còn hiệu lực không
    if (this.accessToken && this.tokenExpiry && new Date() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const tokenUrl = `https://login.microsoftonline.com/${this.tenantId}/oauth2/v2.0/token`;
      
      const params = new URLSearchParams();
      params.append('client_id', this.clientId);
      params.append('client_secret', this.clientSecret);
      params.append('scope', 'https://analysis.windows.net/powerbi/api/.default');
      params.append('grant_type', 'client_credentials');

      const response = await axios.post(tokenUrl, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      this.accessToken = response.data.access_token;
      // Token thường có thời hạn 1 giờ, set expiry sau 55 phút để refresh sớm
      this.tokenExpiry = new Date(Date.now() + 55 * 60 * 1000);

      return this.accessToken;
    } catch (error) {
      console.error('Power BI authentication error:', error.response?.data || error.message);
      throw new HttpException(
        'Không thể xác thực với Power BI',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  /**
   * Lấy dữ liệu từ Power BI dataset bằng DAX query
   */
  async getDatasetData(datasetId: string, daxQuery: string) {
    try {
      const token = await this.authenticate();
      
      const url = `${this.powerBIApiUrl}/datasets/${datasetId}/executeQueries`;
      
      const response = await axios.post(
        url,
        {
          queries: [
            {
              query: daxQuery,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error('Error fetching Power BI data:', error.response?.data || error.message);
      throw new HttpException(
        'Không thể lấy dữ liệu từ Power BI',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Lấy danh sách datasets
   */
  async getDatasets() {
    try {
      const token = await this.authenticate();
      
      const url = `${this.powerBIApiUrl}/datasets`;
      
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching datasets:', error.response?.data || error.message);
      throw new HttpException(
        'Không thể lấy danh sách datasets',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Lấy dữ liệu báo cáo theo thời gian (giả sử có dataset với dữ liệu orders)
   */
  async getReportDataByDateRange(startDate: string, endDate: string) {
    try {
      // Kiểm tra credentials
      if (!this.clientId || !this.clientSecret) {
        throw new HttpException(
          'Power BI credentials chưa được cấu hình. Vui lòng thêm POWERBI_CLIENT_ID và POWERBI_CLIENT_SECRET vào file .env',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Lấy danh sách datasets để tìm dataset liên quan
      const datasets = await this.getDatasets();
      
      if (!datasets.value || datasets.value.length === 0) {
        throw new HttpException(
          'Không tìm thấy dataset nào. Vui lòng kiểm tra quyền truy cập Power BI workspace.',
          HttpStatus.NOT_FOUND,
        );
      }

      // Sử dụng dataset đầu tiên (có thể cần điều chỉnh logic này)
      const datasetId = datasets.value[0].id;

      // DAX query đơn giản hơn để lấy tổng hợp dữ liệu
      // Lưu ý: Cần điều chỉnh tên bảng và cột theo cấu trúc dataset thực tế
      const daxQuery = `
        EVALUATE
        ROW(
          "TotalRevenue", CALCULATE(SUM('Orders'[TotalAmount]), 
            FILTER('Orders', 
              'Orders'[OrderDate] >= DATE(${startDate}) && 
              'Orders'[OrderDate] <= DATE(${endDate}) &&
              'Orders'[Status] = "success"
            )
          ),
          "TotalCost", CALCULATE(
            SUMX('Orders', 'Orders'[ImportPrice] * 'Orders'[Quantity]),
            FILTER('Orders',
              'Orders'[OrderDate] >= DATE(${startDate}) && 
              'Orders'[OrderDate] <= DATE(${endDate}) &&
              'Orders'[Status] = "success"
            )
          ),
          "OrderCount", CALCULATE(
            COUNTROWS('Orders'),
            FILTER('Orders',
              'Orders'[OrderDate] >= DATE(${startDate}) && 
              'Orders'[OrderDate] <= DATE(${endDate}) &&
              'Orders'[Status] = "success"
            )
          )
        )
      `;

      const data = await this.getDatasetData(datasetId, daxQuery);
      
      // Tính toán tổng hợp
      let totalRevenue = 0;
      let totalCost = 0;
      let orderCount = 0;

      if (data.results && data.results[0] && data.results[0].tables && data.results[0].tables[0]) {
        const rows = data.results[0].tables[0].rows;
        if (rows && rows.length > 0) {
          const row = rows[0];
          totalRevenue = row[0] || 0;
          totalCost = row[1] || 0;
          orderCount = row[2] || 0;
        }
      }

      return {
        totalRevenue,
        totalCost,
        profit: totalRevenue - totalCost,
        orderCount,
        startDate,
        endDate,
      };
    } catch (error) {
      console.error('Error getting report data from Power BI:', error);
      // Trả về lỗi chi tiết hơn
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.response?.data?.error?.message || error.message || 'Không thể lấy dữ liệu từ Power BI. Vui lòng kiểm tra cấu hình.',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

