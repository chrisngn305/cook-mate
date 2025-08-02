import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Recipe } from '../recipes/recipe.entity';
import { FridgeIngredient } from '../fridge/fridge-ingredient.entity';
import { ShoppingList } from '../shopping/shopping-list.entity';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  avatar?: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Column({ default: 0 })
  recipesCount: number;

  @Column({ default: 0 })
  favoritesCount: number;

  @Column({ default: 0 })
  shoppingListsCount: number;

  @Column({ default: 0 })
  daysStreak: number;

  @Column({ type: 'json', nullable: true })
  preferences: {
    cuisine?: string[];
    dietaryRestrictions?: string[];
    cookingSkill?: 'beginner' | 'intermediate' | 'advanced';
    favoriteIngredients?: string[];
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => Recipe, recipe => recipe.user)
  recipes: Recipe[];

  @OneToMany(() => FridgeIngredient, ingredient => ingredient.user)
  fridgeIngredients: FridgeIngredient[];

  @OneToMany(() => ShoppingList, list => list.user)
  shoppingLists: ShoppingList[];
} 