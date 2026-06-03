import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('auth_tokens')
export class AuthToken {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Index()
    @Column()
    userId: string;

    @Column({ length: 64 })
    tokenHash: string;

    @Column({ length: 64, nullable: true })
    refreshTokenHash: string;

    @Column({ default: true })
    isActive: boolean;

    @Column({ nullable: true, type: 'timestamp' })
    expiresAt: Date;

    @Column({ nullable: true })
    deviceInfo: string;

    @Column({ nullable: true })
    ipAddress: string;

    @Column({ nullable: true })
    userAgent: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
