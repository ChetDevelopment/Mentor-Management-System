import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import {ManyToOne, JoinColumn, ManyToMany} from 'typeorm';
import {Category} from '../category/category.entity';
import {Mentor} from '../mentor/mentor.entity';


@Entity('skills')
export class Skill {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => Category, category => category.skills)
  @JoinColumn()
  category: Category;

  @Column({nullable: true})
  categoryId: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToMany(() => Mentor, mentor => mentor.skills)
  mentors: Mentor[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
