export declare class PowerBIService {
    private readonly powerBIApiUrl;
    private accessToken;
    private tokenExpiry;
    private readonly clientId;
    private readonly clientSecret;
    private readonly tenantId;
    private readonly reportId;
    private authenticate;
    getDatasetData(datasetId: string, daxQuery: string): Promise<any>;
    getDatasets(): Promise<any>;
    getReportDataByDateRange(startDate: string, endDate: string): Promise<{
        totalRevenue: number;
        totalCost: number;
        profit: number;
        orderCount: number;
        startDate: string;
        endDate: string;
    }>;
}
