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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShippingInfoDto = void 0;
const class_validator_1 = require("class-validator");
class ShippingInfoDto {
}
exports.ShippingInfoDto = ShippingInfoDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Vui lòng nhập tên người nhận' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2, { message: 'Tên người nhận phải có ít nhất 2 ký tự' }),
    __metadata("design:type", String)
], ShippingInfoDto.prototype, "receiver", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Vui lòng nhập số điện thoại' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^(0|\+84|84)[0-9]{9,10}$/, {
        message: 'Số điện thoại không đúng định dạng. Vui lòng nhập số điện thoại Việt Nam (10 số bắt đầu bằng 0)',
    }),
    __metadata("design:type", String)
], ShippingInfoDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Vui lòng nhập địa chỉ' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ShippingInfoDto.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Vui lòng nhập chi tiết địa chỉ' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ShippingInfoDto.prototype, "addressDetail", void 0);
//# sourceMappingURL=ShippingInfo.dto.js.map