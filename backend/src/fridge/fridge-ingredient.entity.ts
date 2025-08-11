import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('fridge_ingredients')
export class FridgeIngredient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  quantity?: number;

  @Column({ nullable: true })
  unit?: string;

  @Column({ type: 'date', nullable: true, transformer: {
    to: (value: Date | string) => {
      if (!value) return null;
      if (typeof value === 'string') {
        return value.split('T')[0]; // Extract just the date part from ISO string
      }
      return value.toISOString().split('T')[0];
    },
    from: (value: string) => value ? new Date(value) : null
  }})
  expiryDate?: Date;

  @Column({ default: false })
  isExpired: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, user => user.fridgeIngredients, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;
} 