import { Injectable, NotFoundException } from '@nestjs/common';
import { MessageRepository } from '../../repositories/message/message.repository';
import { CreateMessageDto } from '../../dto/message';

@Injectable()
export class MessageService {
  constructor(private readonly messageRepo: MessageRepository) {}

  // 11.15 Send message
  async sendMessage(dto: CreateMessageDto) {
    return this.messageRepo.create(dto);
  }

  // 11.16 Get conversation between two users
  async getConversation(senderId: string, receiverId: string) {
    return this.messageRepo.findConversation(senderId, receiverId);
  }

  // 11.17 Get conversation list (unique threads)
  async getConversationList(userId: string) {
    return this.messageRepo.findConversationList(userId);
  }

  // 11.18 Mark message as read
  async markAsRead(id: string) {
    await this.messageRepo.findById(id);
    return this.messageRepo.markAsRead(id, 'true');
  }
}
