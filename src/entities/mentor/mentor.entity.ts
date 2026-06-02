import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { User } from '../user/user.entity';
import { MentorStatus } from '../../constants';
import{Skill} from '../skill/skill.entity'

export enum AvailabilityStatus {
  AVAILABLE = 'available',
  BUSY = 'busy',
  UNAVAILABLE = 'unavailable',
}

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

  @Column({ nullable: true, length: 160 })
  shortDescription: string;

  @Column({ nullable: true, length: 1000 })
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

  @Column('int', { default: 0 })
  yearsOfExperience: number;

  @ManyToMany(() => Skill, skill => skill.mentors)
  @JoinTable({name: 'mentor_skills'})
  skills: Skill[];

  @Column({ default: 0 })
  rating: number;

  @Column({ default: 0 })
  totalSessions: number;

  @Column({ type: 'enum', enum: AvailabilityStatus, default: AvailabilityStatus.AVAILABLE })
  availabilityStatus: AvailabilityStatus;

  @Column({ type: 'int', default: 0 })
  profileCompleteness: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
  feedbacks: any;
}
