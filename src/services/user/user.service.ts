import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../../repositories/user/user.repository';
import { CreateUserDto } from '../../dto/user';

@Injectable()
export class UserService {
    constructor(private userRepository: UserRepository) {}

    async create(createUserDto: CreateUserDto) {
        const hashedPassword = await this.hashPassword(createUserDto.password);
        return this.userRepository.create({
            ...createUserDto,
            password: hashedPassword,
        });
    }

    async findAll() {
        return this.userRepository.findAll();
    }

    async findById(id: string) {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    async findByEmail(email: string) {
        return this.userRepository.findByEmail(email);
    }

    async hashPassword(password: string) {
        return bcrypt.hash(password, 10);
    }

    async comparePassword(password: string, hashedPassword: string) {
        return bcrypt.compare(password, hashedPassword);
    }

    async update(id: string, data: Record<string, any>) {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        // Never allow direct role or password updates via this method
        const safeData: Record<string, any> = {};
        const allowedFields = [
            'firstName', 'lastName', 'phone', 'avatar',
            'failedLoginCount', 'lockedUntil', 'lastLogin',
            'resetToken', 'resetTokenExpiry',
            'isEmailVerified', 'emailVerificationToken', 'emailVerifiedAt',
            'isActive',
        ];
        for (const field of allowedFields) {
            if (data[field] !== undefined) {
                safeData[field] = data[field];
            }
        }
        return this.userRepository.update(id, safeData);
    }

    async updatePassword(id: string, hashedPassword: string) {
        return this.userRepository.update(id, { password: hashedPassword });
    }

    async delete(id: string) {
        return this.userRepository.delete(id);
    }

    async remove(id: string) {
        return this.delete(id);
    }
}
