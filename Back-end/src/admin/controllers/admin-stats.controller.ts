import { Controller, Get, Query } from '@nestjs/common';
import { AdminStatsService } from '../services/admin-stats.service';

@Controller('admin')
export class AdminStatsController {
  constructor(private readonly adminStatsService: AdminStatsService) {}

  @Get('stats')
  async getStats(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    try {
      console.log('Admin stats request:', { startDate, endDate });
      const stats = await this.adminStatsService.getAdminStats(startDate, endDate);
      console.log('Stats calculated:', {
        kpis: stats.kpis,
        revenueByTimeCount: stats.revenueByTime?.length || 0,
        topProductsCount: stats.topProducts?.length || 0,
        orderStatusCount: stats.orderStatusStats?.length || 0,
      });
      return stats;
    } catch (error) {
      console.error('Error in getStats:', error);
      throw error;
    }
  }
}

