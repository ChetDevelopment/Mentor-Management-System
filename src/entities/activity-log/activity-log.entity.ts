import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ActivityType } from '../../constants';

@Entity('activity_logs')
export class ActivityLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  userId: string;

  @Column({ type: 'enum', enum: ActivityType })
  action: ActivityType;

  @Column()
  entity: string;

  @Column()
  entityId: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({ nullable: true })
  ipAddress: string;

  @Column({ nullable: true })
  userAgent: string;

  @Column({ nullable: true })
  metadata: string;

  @CreateDateColumn()
  createdAt: Date;
}
