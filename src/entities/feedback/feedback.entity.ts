import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Mentor } from '../mentor/mentor.entity';
import { Mentee } from '../mentee/mentee.entity';
import { Session } from '../session/session.entity';

@Entity('feedback')
export class Feedback {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  mentorId: string;

  @Column()
  menteeId: string;

  @Column()
  sessionId: string;

  @Column({ type: 'int', width: 1, nullable: true })
  ratingKnowledge: number;

  @Column({ type: 'int', width: 1, nullable: true })
  ratingCommunication: number;

  @Column({ type: 'int', width: 1, nullable: true })
  ratingHelpfulness: number;

  @Column({ type: 'decimal', precision: 3, scale: 1, nullable: true })
  overallRating: number;

  @Column({ nullable: true })
  comment?: string;

  @Column({ default: false })
  isAnonymous: boolean;

  @Column({ type: 'int', width: 1 })
  rating: number; // 1–5

  @Column('text', { nullable: true })
  mentorResponse: string;

  @CreateDateColumn()
  createdAt: Date;

  // Relations
  @ManyToOne(() => Mentor, mentor => mentor.feedbacks)
  @JoinColumn({ name: 'mentorId' })
  mentor: Mentor;

  @ManyToOne(() => Mentee, mentee => mentee.feedbacks)
  mentee: Mentee;

  @ManyToOne(() => Session, session => session.feedbacks)
  session: Session;
}
