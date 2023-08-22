import * as moment from 'moment';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { VideoEntity } from './video.entity';

@Entity('branches')
export class BrachEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  address?: string;

  @ManyToMany(() => VideoEntity)
  @JoinTable()
  videos: VideoEntity[];

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  get _createdAt(): string {
    return moment(this.createdAt).format('YYYY-MM-DD HH:mm:ss');
  }
}
