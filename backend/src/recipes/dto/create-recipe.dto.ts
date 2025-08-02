import { IsString, IsNumber, IsEnum, IsOptional, IsArray, ValidateNested, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { DifficultyLevel } from '../recipe.entity';

export class CreateRecipeIngredientDto {
  @IsString()
  name: string;

  @IsNumber()
  @Min(0)
  quantity: number;

  @IsString()
  unit: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsNumber()
  order: number;
}

export class CreateRecipeStepDto {
  @IsNumber()
  order: number;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  time?: number;
}

export class CreateRecipeDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsNumber()
  @Min(1)
  cookingTime: number;

  @IsEnum(DifficultyLevel)
  difficulty: DifficultyLevel;

  @IsNumber()
  @Min(1)
  servings: number;

  @IsOptional()
  @IsString()
  cuisine?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  occasion?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  mood?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  season?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tagIds?: string[];

  @ValidateNested({ each: true })
  @Type(() => CreateRecipeIngredientDto)
  @IsArray()
  ingredients: CreateRecipeIngredientDto[];

  @ValidateNested({ each: true })
  @Type(() => CreateRecipeStepDto)
  @IsArray()
  steps: CreateRecipeStepDto[];
} 