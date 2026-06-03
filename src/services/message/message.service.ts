import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { MessageRepository } from '../../repositories/message/message.repository';
import { CreateMessageDto } from '../../dto/message';

@Injectable()
export class MessageService {
    constructor(private readonly messageRepo: MessageRepository) {}

    async sendMessage(dto: CreateMessageDto) {
        return this.messageRepo.create(dto);
    }

    async getConversation(senderId: string, receiverId: string) {
        return this.messageRepo.findConversation(senderId, receiverId);
    }

    async getConversationList(userId: string) {
        return this.messageRepo.findConversationList(userId);
    }

    async markAsRead(messageId: string, userId: string) {
        const message = await this.messageRepo.findById(messageId);
        if (!message) throw new NotFoundException('Message not found');

        // Only the receiver can mark as read
        if (message.receiverId !== userId) {
            throw new ForbiddenException('You can only mark your own messages as read');
        }

        return this.messageRepo.markAsRead(message.id, userId);
    }
}
