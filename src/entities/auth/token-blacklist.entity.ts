import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('token_blacklist')
export class TokenBlacklist {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Index()
    @Column({ length: 64 })
    tokenHash: string;

    @Column({ type: 'timestamp' })
    expiresAt: Date;

    @CreateDateColumn()
    createdAt: Date;
}
