import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../../entities/message.entity';

@Injectable()
export class MessageRepository {
  findById(id: string) {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(Message)
    private repository: Repository<Message>,
  ) {}

  async findConversation(userId1: string, userId2: string): Promise<Message[]> {
    return this.repository.find({
      where: [
        { senderId: userId1, receiverId: userId2 },
        { senderId: userId2, receiverId: userId1 },
      ],
      relations: ['sender', 'receiver'],
      order: { createdAt: 'ASC' },
    });
  }

  async findConversationList(userId: string): Promise<Message[]> {
    const subquery = this.repository
      .createQueryBuilder('m')
      .select('MAX(m.createdAt)', 'maxDate')
      .addSelect('CASE WHEN m.senderId = :userId THEN m.receiverId ELSE m.senderId END', 'otherUserId')
      .where('m.senderId = :userId OR m.receiverId = :userId')
      .groupBy('otherUserId');

    const results = await this.repository
      .createQueryBuilder('m')
      .innerJoin(
        `(${subquery.getQuery()})`,
        'latest',
        'm.createdAt = latest.maxDate',
      )
      .setParameter('userId', userId)
      .leftJoinAndSelect('m.sender', 'sender')
      .leftJoinAndSelect('m.receiver', 'receiver')
      .orderBy('m.createdAt', 'DESC')
      .getMany();

    return results;
  }

  async create(data: Partial<Message>): Promise<Message> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async markAsRead(senderId: string, receiverId: string): Promise<void> {
    await this.repository.update(
      { senderId, receiverId, isRead: false },
      { isRead: true, readAt: new Date() },
    );
  }
}
