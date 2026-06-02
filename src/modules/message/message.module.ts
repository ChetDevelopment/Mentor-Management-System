import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageController } from '../../controllers/message/message.controller';
import { MessageService } from '../../services/message/message.service';
import { MessageRepository } from '../../repositories/message/message.repository';
import { Message } from '../../entities/message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Message])],
  controllers: [MessageController],
  providers: [MessageService, MessageRepository],
  exports: [MessageService],
})
export class MessageModule {}
