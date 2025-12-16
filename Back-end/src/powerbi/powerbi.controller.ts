import { Controller, Get, Query } from '@nestjs/common';
import { PowerBIService } from './powerbi.service';

@Controller('powerbi')
export class PowerBIController {
  constructor(private readonly powerBIService: PowerBIService) {}

  @Get('datasets')
  async getDatasets() {
    return this.powerBIService.getDatasets();
  }

  @Get('report-data')
  async getReportData(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    if (!startDate || !endDate) {
      return {
        error: 'Vui lòng cung cấp startDate và endDate',
      };
    }
    return this.powerBIService.getReportDataByDateRange(startDate, endDate);
  }
}


