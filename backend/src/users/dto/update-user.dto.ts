import { PartialType } from '@nestjs/mapped-types';
import {
  IsEmail,
  IsString,
  IsOptional,
  MinLength,
  IsEnum,
  IsNumber,
  IsArray,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateUserDto } from './create-user.dto';

export class UserPreferencesDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  cuisine?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  dietaryRestrictions?: string[];

  @IsOptional()
  @IsEnum(['beginner', 'intermediate', 'advanced'])
  cookingSkill?: 'beginner' | 'intermediate' | 'advanced';

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  favoriteIngredients?: string[];
}

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsNumber()
  recipesCount?: number;

  @IsOptional()
  @IsNumber()
  favoritesCount?: number;

  @IsOptional()
  @IsNumber()
  shoppingListsCount?: number;

  @IsOptional()
  @IsNumber()
  daysStreak?: number;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => UserPreferencesDto)
  preferences?: UserPreferencesDto;
} 