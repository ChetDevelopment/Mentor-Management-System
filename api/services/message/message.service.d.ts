import { MessageRepository } from '../../repositories/message/message.repository';
import { CreateMessageDto } from '../../dto/message';
export declare class MessageService {
    private readonly messageRepo;
    constructor(messageRepo: MessageRepository);
    sendMessage(dto: CreateMessageDto): Promise<import("../../entities/message.entity").Message>;
    getConversation(senderId: string, receiverId: string): Promise<import("../../entities/message.entity").Message[]>;
    getConversationList(userId: string): Promise<import("../../entities/message.entity").Message[]>;
    markAsRead(messageId: string, userId: string): Promise<void>;
}
