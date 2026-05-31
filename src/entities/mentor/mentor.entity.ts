import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { MentorStatus } from '../../constants';

@Entity('mentors')
export class Mentor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @Column()
  userId: string;

  @Column({ unique: true })
  nid: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  cvUrl: string;

  @Column({ nullable: true })
  portfolioUrl: string;

  @Column({ nullable: true })
  shortDescription: string;

  @Column('text', { nullable: true })
  fullBio: string;

  @Column({ type: 'enum', enum: MentorStatus, default: MentorStatus.PENDING })
  status: MentorStatus;

  @Column({ nullable: true })
  rejectionReason: string;

  @Column({ nullable: true })
  approvedAt: Date;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  company: string;

  @Column('text', { nullable: true })
  bio: string;

  @Column('int', { default: 0 })
  yearsOfExperience: number;

  @Column('simple-array', { nullable: true })
  skills: string[];

  @Column({ default: 0 })
  rating: number;

  @Column({ default: 0 })
  totalSessions: number;

  @Column({ default: true })
  isAvailable: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
