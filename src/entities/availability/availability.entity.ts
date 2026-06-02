import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn} from 'typeorm';

@Entity('availabilities')
export class Availability{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    mentorId: string;

    @Column({type: 'date'})
    date: string;

    @Column({type: 'time'})
    startTime: string;

    @Column({type: 'time'})
    endTime: string;

    @Column({default: false})
    isBlocked: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
    dayOfWeek: string;
    isActive: boolean;

}