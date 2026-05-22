import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { MatchingStatus } from '../../constants';

@Entity('matchings')
export class Matching {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  mentorId: string;

  @Column()
  menteeId: string;

  @Column({ type: 'enum', enum: MatchingStatus, default: MatchingStatus.PENDING })
  status: MatchingStatus;

  @Column('text', { nullable: true })
  reason: string;

  @Column({ nullable: true })
  matchedBy: string;

  @Column({ nullable: true })
  matchedAt: Date;

  @Column({ nullable: true })
  completedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
