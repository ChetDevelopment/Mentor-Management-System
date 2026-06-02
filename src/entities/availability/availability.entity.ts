import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { DayOfWeek } from '../../constants';

@Entity('availabilities')
export class Availability {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    mentorId: string;

    @Column({ type: 'enum', enum: DayOfWeek })
    dayOfWeek: DayOfWeek;

    @Column({ type: 'time' })
    startTime: string;

    @Column({ type: 'time' })
    endTime: string;

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
<<<<<<< HEAD
}
=======
    dayOfWeek: string;
    isActive: boolean;

}
>>>>>>> Develop
