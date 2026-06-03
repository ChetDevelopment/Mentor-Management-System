import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum SessionRequestStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  DECLINED = 'declined',
}

@Entity('session_requests')
export class SessionRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  sessionId: string;

  @Column('text', { nullable: true })
  message: string;

  @Column({ type: 'enum', enum: SessionRequestStatus, default: SessionRequestStatus.PENDING })
  requestStatus: SessionRequestStatus;

  @Column({ nullable: true, type: 'timestamp' })
  respondedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
