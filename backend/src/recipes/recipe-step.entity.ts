import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Recipe } from './recipe.entity';

@Entity('recipe_steps')
export class RecipeStep {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int' })
  order: number;

  @Column({ type: 'text' })
  description: string;

  @Column({ nullable: true })
  image?: string;

  @Column({ type: 'int', nullable: true })
  time?: number; // in minutes

  // Relations
  @ManyToOne(() => Recipe, recipe => recipe.steps, {
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