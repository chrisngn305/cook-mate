import { PartialType } from '@nestjs/mapped-types';
import { IsEmail, IsString, IsOptional, MinLength, IsEnum, IsNumber } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
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
} 