import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
} from 'typeorm';

@Entity('user_sessions')
export class UserSession {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Index()
    @Column()
    userId: string;

    @Column({ length: 64 })
    tokenHash: string;

    @Column({ length: 64, nullable: true })
    refreshTokenHash: string;

    @Column({ nullable: true })
    deviceName: string;

    @Column({ nullable: true })
    deviceType: string;

    @Column({ nullable: true })
    os: string;

    @Column({ nullable: true })
    browser: string;

    @Column({ nullable: true })
    ipAddress: string;

    @Column({ nullable: true })
    userAgent: string;

    @Column({ nullable: true })
    location: string;

    @Column({ default: true })
    isActive: boolean;

    @Column({ type: 'timestamp', nullable: true })
    lastActivityAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    expiresAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    loggedOutAt: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
