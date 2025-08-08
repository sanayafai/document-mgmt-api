import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Document {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'jsonb', nullable: true })
  embeddings: number[];

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: 'pending' })
  status: 'pending' | 'ingested';

}
