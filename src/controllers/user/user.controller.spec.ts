import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '../../services/user/user.service';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';

describe('UserController', () => {
    let controller: UserController;
    let userService: Partial<Record<keyof UserService, jest.Mock>>;

    const mockUser = {
        id: 'user-uuid-123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        role: 'mentee',
        phone: '1234567890',
        avatar: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    beforeEach(async () => {
        userService = {
            findById: jest.fn(),
            findAll: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [
                { provide: UserService, useValue: userService },
            ],
        })
            .overrideGuard(AuthGuard)
            .useValue({ canActivate: jest.fn(() => true) })
            .overrideGuard(RolesGuard)
            .useValue({ canActivate: jest.fn(() => true) })
            .compile();

        controller = module.get<UserController>(UserController);
    });

    it('GET /users/profile — should return the authenticated user profile', async () => {
        userService.findById.mockResolvedValue(mockUser);

        const result = await controller.getProfile(mockUser.id);

        expect(userService.findById).toHaveBeenCalledWith(mockUser.id);
        expect(result).toEqual(mockUser);
    });

    it('Put /users/profile - should update the authentication user profile', async () => {
        const updateUserDto = {
            firstName: 'Jane',
            lastName: 'Smith',
            phone: '0987654321',
        };

        const updatedUser = { ...mockUser, ...updateUserDto };
        userService.update.mockResolvedValue(updatedUser);

        const result = await controller.updateProfile(mockUser.id, updateUserDto);

        expect(userService.update).toHaveBeenCalledWith(mockUser.id, updateUserDto);
        expect(result).toEqual(updatedUser);
    })

    it('GET /users - should return an array of all users', async() =>{
        const users = [mockUser];
        userService.findAll.mockResolvedValue(users);

        const result = await controller.findAll();

        expect(userService.findAll).toHaveBeenCalled();
        expect(result).toEqual(users);
    });

    it('GET /users/:id — admin should get a user by ID', async () => {
        userService.findById.mockResolvedValue(mockUser);

        const result = await controller.findById(mockUser.id);

        expect(userService.findById).toHaveBeenCalledWith(mockUser.id);
        expect(result).toEqual(mockUser);
    });

    it('PUT /users/:id — admin should update any user', async () => {
        const updateDto = { firstName: 'Jane', phone: '0987654321' };
        const updated = { ...mockUser, ...updateDto };
        userService.update.mockResolvedValue(updated);

        const result = await controller.updateUser(mockUser.id, updateDto);

        expect(userService.update).toHaveBeenCalledWith(mockUser.id, updateDto);
        expect(result.firstName).toBe('Jane');
    });

    it('DELETE /users/:id — admin should delete a user', async () => {
        userService.delete.mockResolvedValue(undefined);

        await controller.deleteUser(mockUser.id);

        expect(userService.delete).toHaveBeenCalledWith(mockUser.id);
    });
});
