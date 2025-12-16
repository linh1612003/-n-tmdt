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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./services/user.service");
const update_user_Dto_1 = require("./dto/update-user.Dto");
const user_repository_1 = require("./repository/user.repository");
let UserController = class UserController {
    constructor(userService, userRepository) {
        this.userService = userService;
        this.userRepository = userRepository;
    }
    async updateShippingInfo(userId, data) {
        console.log('=== UserController - updateShippingInfo ===');
        console.log('userId:', userId);
        console.log('received data:', JSON.stringify(data, null, 2));
        try {
            const result = await this.userService.updateShippingInfo(userId, data);
            console.log('UserController - updateShippingInfo - result:', result);
            const updatedUser = await this.userRepository.findById(userId);
            console.log('UserController - Verified saved data:');
            console.log('  - address:', updatedUser?.address);
            console.log('  - addressDetail:', updatedUser?.addressDetail);
            console.log('  - contactPhone:', updatedUser?.contactPhone);
            console.log('=== End UserController - updateShippingInfo ===');
            return result;
        }
        catch (error) {
            console.error('UserController - updateShippingInfo - error:', error);
            throw error;
        }
    }
    async updateUser(userId, updateUserDto) {
        return this.userService.updateUser(userId, updateUserDto);
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Put)(':userId/shipping-infor'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateShippingInfo", null);
__decorate([
    (0, common_1.Put)(':userId'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_Dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUser", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [user_service_1.UserService,
        user_repository_1.UserRepository])
], UserController);
//# sourceMappingURL=user.controller.js.map