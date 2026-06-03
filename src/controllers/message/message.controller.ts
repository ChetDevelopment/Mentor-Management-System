import {
    Controller, Post, Get, Put, Body, Param, UseGuards,
    ForbiddenException,
} from '@nestjs/common';
import { MessageService } from '../../services/message/message.service';
import { CreateMessageDto } from '../../dto/message';
import { AuthGuard } from '../../guards/auth.guard';
import { User } from '../../decorators/user.decorator';

@Controller('messages')
@UseGuards(AuthGuard)
export class MessageController {
    constructor(private readonly messageService: MessageService) {}

    @Post()
    async sendMessage(@Body() dto: CreateMessageDto, @User() user: any) {
        // Users can only send messages as themselves
        if (dto.senderId !== user.userId) {
            throw new ForbiddenException('You can only send messages as yourself');
        }
        return this.messageService.sendMessage(dto);
    }

    @Get('conversations')
    async getConversationList(@User() user: any) {
        return this.messageService.getConversationList(user.userId);
    }

    @Get(':senderId/:receiverId')
    async getConversation(
        @Param('senderId') senderId: string,
        @Param('receiverId') receiverId: string,
        @User() user: any,
    ) {
        // User must be one of the participants
        if (senderId !== user.userId && receiverId !== user.userId) {
            throw new ForbiddenException('You can only view your own conversations');
        }
        return this.messageService.getConversation(senderId, receiverId);
    }

    @Put(':id/read')
    async markAsRead(@Param('id') id: string, @User() user: any) {
        return this.messageService.markAsRead(id, user.userId);
    }
}
