import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsBoolean, IsDateString } from 'class-validator';
import { CreateShoppingListDto } from './create-shopping-list.dto';

export class UpdateShoppingListDto extends PartialType(CreateShoppingListDto) {
  @IsOptional()
  @IsBoolean()
  isCompleted?: boolean;

  @IsOptional()
  @IsDateString()
  completedAt?: string;
} 