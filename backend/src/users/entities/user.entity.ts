import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Role } from 'src/common/enums/role.enum';

@Entity({ name: 'users' }) // Specifies the table name
export class User {
  
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20, nullable: true })
  firstname: string;

  @Column({ length: 20, nullable: true })
  lastname: string;

  @Column()
  email: string;

  @Column({ length: 20, nullable: true })
  mobile: string;

  @Column({ length: 20 })
  username: string;

  @Column()
  password: string;

  @Column({nullable: true})
  userpic: string;

  @Column({nullable: false, default: 'ROLE_USER'})
  roles: string;

  // @Column({
  //   type: 'jsonb',
  //   array: false,
  //   default: [Role.User],
  // })
  // roles: Role[];
  
  @Column({nullable: true})
  secret: string;

  // @Column({
  //   type: 'blob' // Use 'blob', 'longblob', 'bytea', etc. depending on your DB
  // })
  // qrcodeurl: Buffer;
  @Column({ type: 'text', nullable: true })
  qrcodeurl: string;

  @Column({ default: true })
  isactivated: boolean;

  @Column({ default: true })
  isblocked: boolean;
  
  // POSTGRESQL @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  // MYSQL/MARIADB @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
