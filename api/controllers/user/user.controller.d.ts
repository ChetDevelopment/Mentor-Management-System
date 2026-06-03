import { UserService } from '../../services/user/user.service';
import { UpdateUserDto } from '../../dto/user/update_user.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getProfile(user: any): Promise<import("../../entities/user/user.entity").User>;
    updateProfile(user: any, updateUserDto: UpdateUserDto): Promise<import("../../entities/user/user.entity").User>;
    findAll(): Promise<import("../../entities/user/user.entity").User[]>;
    findById(id: string): Promise<import("../../entities/user/user.entity").User>;
    updateUser(id: string, updateUserDto: UpdateUserDto): Promise<import("../../entities/user/user.entity").User>;
    deleteUser(id: string): Promise<void>;
}
