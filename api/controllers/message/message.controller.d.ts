import { MessageService } from '../../services/message/message.service';
import { CreateMessageDto } from '../../dto/message';
export declare class MessageController {
    private readonly messageService;
    constructor(messageService: MessageService);
    sendMessage(dto: CreateMessageDto, user: any): Promise<import("../../entities/message.entity").Message>;
    getConversationList(user: any): Promise<import("../../entities/message.entity").Message[]>;
    getConversation(senderId: string, receiverId: string, user: any): Promise<import("../../entities/message.entity").Message[]>;
    markAsRead(id: string, user: any): Promise<void>;
}
