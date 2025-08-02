import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum TagType {
  CUISINE = 'cuisine',
  TASTE = 'taste',
  DIFFICULTY = 'difficulty',
  OCCASION = 'occasion',
  MOOD = 'mood',
  SEASON = 'season',
}

@Entity('recipe_tags')
export class RecipeTag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: TagType })
  type: TagType;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  icon?: string;

  @Column({ default: 0 })
  usageCount: number;
} 