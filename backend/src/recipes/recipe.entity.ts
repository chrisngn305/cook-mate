import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { User } from '../users/user.entity';
import { RecipeIngredient } from './recipe-ingredient.entity';
import { RecipeStep } from './recipe-step.entity';
import { RecipeTag } from './recipe-tag.entity';

export enum DifficultyLevel {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

export enum CookingTimeCategory {
  SHORT = 'short', // < 30 min
  MEDIUM = 'medium', // 30-60 min
  LONG = 'long', // > 60 min
}

@Entity('recipes')
export class Recipe {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ nullable: true })
  image?: string;

  @Column({ type: 'int' })
  cookingTime: number; // in minutes

  @Column({ type: 'enum', enum: DifficultyLevel })
  difficulty: DifficultyLevel;

  @Column({ type: 'int', default: 1 })
  servings: number;

  @Column({ nullable: true })
  cuisine?: string;

  @Column({ type: 'simple-array', nullable: true })
  occasion?: string[];

  @Column({ type: 'simple-array', nullable: true })
  mood?: string[];

  @Column({ type: 'simple-array', nullable: true })
  season?: string[];

  @Column({ default: 0 })
  views: number;

  @Column({ default: 0 })
  likes: number;

  @Column({ default: false })
  isPublic: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, user => user.recipes)
  user: User;

  @Column()
  userId: string;

  @OneToMany(() => RecipeIngredient, ingredient => ingredient.recipe, {
    cascade: true,
    eager: true
  })
  ingredients: RecipeIngredient[];

  @OneToMany(() => RecipeStep, step => step.recipe, {
    cascade: true,
    eager: true
  })
  steps: RecipeStep[];

  @ManyToMany(() => RecipeTag)
  @JoinTable({
    name: 'recipe_recipe_tags',
    joinColumn: { name: 'recipeId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tagId', referencedColumnName: 'id' },
  })
  tags: RecipeTag[];
} 