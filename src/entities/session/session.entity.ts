import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { SessionStatus } from '../../constants';
import { Mentor } from '../mentor/mentor.entity';
import { Mentee } from '../mentee/mentee.entity';

@Entity('sessions')
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Mentor)
  @JoinColumn({ name: 'mentorId' })
  mentor: Mentor;

  @Column()
  mentorId: string;

  @ManyToOne(() => Mentee)
  @JoinColumn({ name: 'menteeId' })
  mentee: Mentee;

  @Column()
  menteeId: string;

  @Column()
  title: string;

  @Column('text', { nullable: true })
  description: string;

  @Column()
  scheduledAt: Date;

  @Column({ nullable: true })
  duration: number;

  @Column({ type: 'enum', enum: SessionStatus, default: SessionStatus.SCHEDULED })
  status: SessionStatus;

  @Column({ nullable: true })
  meetingLink: string;

  @Column('text', { nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
  feedbacks: any;
}
