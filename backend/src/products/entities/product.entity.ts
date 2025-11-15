import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'products' })
export class Product {
  
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, nullable: true })
  category: string;

  @Column({ length: 255, nullable: true })
  descriptions: string;

  @Column({default: 0})
  qty: number;

  @Column({ length: 255, nullable: true })
  unit: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0.00,
  })
  costprice: string; 

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0.00,
  })
  sellprice: string; 
  
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0.00,
  })
  saleprice: string; 

  @Column({ length: 255, nullable: true })
  productpicture: string;

  @Column({default: 0})
  alertstocks: number;

  @Column({default: 0})
  criticalstocks: number;

  // POSTGRESQL @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  // MYSQL/MARIADB @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
