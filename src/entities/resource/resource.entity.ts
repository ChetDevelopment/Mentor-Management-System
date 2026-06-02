import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum ResourceType {
    DOCUMENT = 'document',
    LINK = 'link',
    TASK = 'task',
}


@Entity('resources')
export class Resource {
    @PrimaryGeneratedColumn('uuid')
    id: string;


    @Column()
    mentorId: string;

    @Column({ nullable: true })
    sessionId: string;

    @Column()
    title: string;

    @Column('text', { nullable: true })
    description: string;

    @Column({ type: 'enum', enum: ResourceType, default: ResourceType.DOCUMENT })
    type: ResourceType;

    @Column({ nullable: true })
    fileUrl: string;

    @Column({ nullable: true })
    linkUrl: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}