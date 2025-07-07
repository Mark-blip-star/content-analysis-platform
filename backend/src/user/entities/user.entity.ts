import { ContentSubmission } from 'src/content-submission/entities/content-submission.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => ContentSubmission, (submission) => submission.user)
  submissions: ContentSubmission[];
}
