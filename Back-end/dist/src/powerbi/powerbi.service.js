"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PowerBIService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
let PowerBIService = class PowerBIService {
    constructor() {
        this.powerBIApiUrl = 'https://api.powerbi.com/v1.0/myorg';
        this.accessToken = null;
        this.tokenExpiry = null;
        this.clientId = process.env.POWERBI_CLIENT_ID || '';
        this.clientSecret = process.env.POWERBI_CLIENT_SECRET || '';
        this.tenantId = process.env.POWERBI_TENANT_ID || 'e7572e92-7aee-4713-a3c4-ba64888ad45f';
        this.reportId = process.env.POWERBI_REPORT_ID || '41d0d0e2-cd15-4a2d-939e-4b84911bb59b';
    }
    async authenticate() {
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
            const response = await axios_1.default.post(tokenUrl, params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });
            this.accessToken = response.data.access_token;
            this.tokenExpiry = new Date(Date.now() + 55 * 60 * 1000);
            return this.accessToken;
        }
        catch (error) {
            console.error('Power BI authentication error:', error.response?.data || error.message);
            throw new common_1.HttpException('Không thể xác thực với Power BI', common_1.HttpStatus.UNAUTHORIZED);
        }
    }
    async getDatasetData(datasetId, daxQuery) {
        try {
            const token = await this.authenticate();
            const url = `${this.powerBIApiUrl}/datasets/${datasetId}/executeQueries`;
            const response = await axios_1.default.post(url, {
                queries: [
                    {
                        query: daxQuery,
                    },
                ],
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        }
        catch (error) {
            console.error('Error fetching Power BI data:', error.response?.data || error.message);
            throw new common_1.HttpException('Không thể lấy dữ liệu từ Power BI', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getDatasets() {
        try {
            const token = await this.authenticate();
            const url = `${this.powerBIApiUrl}/datasets`;
            const response = await axios_1.default.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        }
        catch (error) {
            console.error('Error fetching datasets:', error.response?.data || error.message);
            throw new common_1.HttpException('Không thể lấy danh sách datasets', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getReportDataByDateRange(startDate, endDate) {
        try {
            if (!this.clientId || !this.clientSecret) {
                throw new common_1.HttpException('Power BI credentials chưa được cấu hình. Vui lòng thêm POWERBI_CLIENT_ID và POWERBI_CLIENT_SECRET vào file .env', common_1.HttpStatus.BAD_REQUEST);
            }
            const datasets = await this.getDatasets();
            if (!datasets.value || datasets.value.length === 0) {
                throw new common_1.HttpException('Không tìm thấy dataset nào. Vui lòng kiểm tra quyền truy cập Power BI workspace.', common_1.HttpStatus.NOT_FOUND);
            }
            const datasetId = datasets.value[0].id;
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
        }
        catch (error) {
            console.error('Error getting report data from Power BI:', error);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException(error.response?.data?.error?.message || error.message || 'Không thể lấy dữ liệu từ Power BI. Vui lòng kiểm tra cấu hình.', error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.PowerBIService = PowerBIService;
exports.PowerBIService = PowerBIService = __decorate([
    (0, common_1.Injectable)()
], PowerBIService);
//# sourceMappingURL=powerbi.service.js.map