import { Repository } from 'typeorm';
import { User } from '../../entities/user/user.entity';
export declare class UserRepository {
    private repository;
    constructor(repository: Repository<User>);
    create(data: Partial<User>): Promise<User>;
    findAll(): Promise<User[]>;
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    update(id: string, data: Partial<User>): Promise<User>;
    delete(id: string): Promise<void>;
    remove(id: string): Promise<void>;
}
