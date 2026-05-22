import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';

@Entity('mentors')
export class Mentor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @Column()
  userId: string;

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
