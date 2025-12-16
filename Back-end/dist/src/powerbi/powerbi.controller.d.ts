import { PowerBIService } from './powerbi.service';
export declare class PowerBIController {
    private readonly powerBIService;
    constructor(powerBIService: PowerBIService);
    getDatasets(): Promise<any>;
    getReportData(startDate: string, endDate: string): Promise<{
        totalRevenue: number;
        totalCost: number;
        profit: number;
        orderCount: number;
        startDate: string;
        endDate: string;
    } | {
        error: string;
    }>;
}
