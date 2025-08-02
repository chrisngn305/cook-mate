import { IsEmail, IsString, IsOptional, MinLength, IsEnum, IsArray } from 'class-validator';
import { UserRole } from '../user.entity';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  preferences?: {
    cuisine?: string[];
    dietaryRestrictions?: string[];
    cookingSkill?: 'beginner' | 'intermediate' | 'advanced';
    favoriteIngredients?: string[];
  };
} 