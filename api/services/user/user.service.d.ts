import { UserRepository } from '../../repositories/user/user.repository';
import { CreateUserDto } from '../../dto/user';
export declare class UserService {
    private userRepository;
    constructor(userRepository: UserRepository);
    create(createUserDto: CreateUserDto): Promise<import("../../entities/user/user.entity").User>;
    findAll(): Promise<import("../../entities/user/user.entity").User[]>;
    findById(id: string): Promise<import("../../entities/user/user.entity").User>;
    findByEmail(email: string): Promise<import("../../entities/user/user.entity").User>;
    hashPassword(password: string): Promise<string>;
    comparePassword(password: string, hashedPassword: string): Promise<boolean>;
    update(id: string, data: Record<string, any>): Promise<import("../../entities/user/user.entity").User>;
    updatePassword(id: string, hashedPassword: string): Promise<import("../../entities/user/user.entity").User>;
    delete(id: string): Promise<void>;
    remove(id: string): Promise<void>;
}
