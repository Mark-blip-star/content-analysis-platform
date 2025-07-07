import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class ContentSubmission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: 'text' | 'url';

  @Column({ default: 'pending' })
  status: 'pending' | 'processing' | 'completed' | 'failed';

  @Column({ type: 'text' })
  rawInput: string;

  @Column({ type: 'text', nullable: true })
  extractedText: string;

  @Column({ type: 'text', nullable: true })
  summary: string;

  @Column({ type: 'text', nullable: true })
  keywords: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.submissions, { onDelete: 'CASCADE' })
  user: User;
}
