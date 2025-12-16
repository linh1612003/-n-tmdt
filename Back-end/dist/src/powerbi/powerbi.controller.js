"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PowerBIController = void 0;
const common_1 = require("@nestjs/common");
const powerbi_service_1 = require("./powerbi.service");
let PowerBIController = class PowerBIController {
    constructor(powerBIService) {
        this.powerBIService = powerBIService;
    }
    async getDatasets() {
        return this.powerBIService.getDatasets();
    }
    async getReportData(startDate, endDate) {
        if (!startDate || !endDate) {
            return {
                error: 'Vui lòng cung cấp startDate và endDate',
            };
        }
        return this.powerBIService.getReportDataByDateRange(startDate, endDate);
    }
};
exports.PowerBIController = PowerBIController;
__decorate([
    (0, common_1.Get)('datasets'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PowerBIController.prototype, "getDatasets", null);
__decorate([
    (0, common_1.Get)('report-data'),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PowerBIController.prototype, "getReportData", null);
exports.PowerBIController = PowerBIController = __decorate([
    (0, common_1.Controller)('powerbi'),
    __metadata("design:paramtypes", [powerbi_service_1.PowerBIService])
], PowerBIController);
//# sourceMappingURL=powerbi.controller.js.map