import { Controller, Post, Get, Put, Body, Param } from '@nestjs/common';
import { MessageService } from '../../services/message/message.service';
import { CreateMessageDto } from '../../dto/message';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  // 11.21 Send message
  @Post()
  async sendMessage(@Body() dto: CreateMessageDto) {
    return this.messageService.sendMessage(dto);
  }

  // 11.22 List all conversations for logged-in user
  @Get('conversations/:userId')
  async getConversationList(@Param('userId') userId: string) {
    return this.messageService.getConversationList(userId);
  }

  // 11.23 Get thread with specific user
  @Get(':senderId/:receiverId')
  async getConversation(
    @Param('senderId') senderId: string,
    @Param('receiverId') receiverId: string,
  ) {
    return this.messageService.getConversation(senderId, receiverId);
  }

  // 11.24 Mark message as read
  @Put(':id/read')
  async markAsRead(@Param('id') id: string) {
    return this.messageService.markAsRead(id);
  }
}
