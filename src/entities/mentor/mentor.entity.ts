import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { User } from '../user/user.entity';
import { MentorStatus } from '../../constants';
import{Skill} from '../skill/skill.entity'

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

  @Column({ length: 160, nullable: true })
  shortDescription: string;

  @Column('text', { nullable: true })
  fullBio: string;


  @Column('int', { default: 0 })
  yearsOfExperience: number;

  @ManyToMany(() => Skill, skill => skill.mentors)
  @JoinTable({name: 'mentor_skills'})
  skills: Skill[];

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
