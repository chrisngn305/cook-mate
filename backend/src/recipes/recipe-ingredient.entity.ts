import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Recipe } from './recipe.entity';

@Entity('recipe_ingredients')
export class RecipeIngredient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  quantity: number;

  @Column()
  unit: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'int' })
  order: number;

  // Relations
  @ManyToOne(() => Recipe, recipe => recipe.ingredients, {
    onDelete: 'CASCADE',
    nullable: false
  })
  @JoinColumn({ name: 'recipeId' })
  recipe: Recipe;

  @Column({ nullable: false })
  recipeId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 