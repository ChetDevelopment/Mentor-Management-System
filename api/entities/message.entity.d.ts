import { User } from './user/user.entity';
export declare class Message {
    id: string;
    sender: User;
    senderId: string;
    receiver: User;
    receiverId: string;
    content: string;
    isRead: boolean;
    readAt: Date;
    createdAt: Date;
}
