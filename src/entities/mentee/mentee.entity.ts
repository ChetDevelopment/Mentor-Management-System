import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity';

export enum MenteeLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
}

@Entity('mentees')
export class Mentee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @Column()
  userId: string;

  @Column({ type: 'enum', enum: MenteeLevel, nullable: true })
  currentLevel: MenteeLevel;

  @Column({ nullable: true })
  organization: string;

  @Column('text', { nullable: true })
  careerGoal: string;

  @Column('simple-array', { nullable: true })
  interests: string[];

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'int', default: 0 })
  profileCompleteness: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
  feedbacks: any;
}
