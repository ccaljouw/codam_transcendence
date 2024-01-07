// src/test/test.entity.ts

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('test') // This should match your table name
export class TestEntity {
  @PrimaryGeneratedColumn('uuid')
  user_id: string;

  @Column({default: 'default_naam'})
  // Define columns that match the structure of your 'test' table
  naam: string;
  
//   @Column({type: 'uuid'})
//   id: string;

  // ... other columns
}