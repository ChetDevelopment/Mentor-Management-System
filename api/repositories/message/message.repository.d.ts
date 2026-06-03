import { Repository } from 'typeorm';
import { Message } from '../../entities/message.entity';
export declare class MessageRepository {
    private repository;
    constructor(repository: Repository<Message>);
    findById(id: string): Promise<Message | null>;
    findConversation(userId1: string, userId2: string): Promise<Message[]>;
    findConversationList(userId: string): Promise<Message[]>;
    create(data: Partial<Message>): Promise<Message>;
    markAsRead(messageId: string, userId: string): Promise<void>;
}
