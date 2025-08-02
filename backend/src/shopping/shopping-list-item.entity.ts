import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ShoppingList } from './shopping-list.entity';

@Entity('shopping_list_items')
export class ShoppingListItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  quantity: number;

  @Column()
  unit: string;

  @Column({ default: false })
  isCompleted: boolean;

  @Column({ nullable: true })
  recipeId?: string; // if added from a recipe

  // Relations
  @ManyToOne(() => ShoppingList, list => list.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'shoppingListId' })
  shoppingList: ShoppingList;

  @Column()
  shoppingListId: string;
} 