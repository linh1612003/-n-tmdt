import { UserService } from './services/user.service';
import { UpdateUserDto } from './dto/update-user.Dto';
import { UserRepository } from './repository/user.repository';
export declare class UserController {
    private readonly userService;
    private readonly userRepository;
    constructor(userService: UserService, userRepository: UserRepository);
    updateShippingInfo(userId: string, data: any): Promise<{
        message: string;
        user: {
            address: string;
            addressDetail: string;
            contactPhone: string;
        };
    }>;
    updateUser(userId: string, updateUserDto: UpdateUserDto): Promise<{
        message: string;
        user: import("../auth/schemas/user.schema").User;
    }>;
}
