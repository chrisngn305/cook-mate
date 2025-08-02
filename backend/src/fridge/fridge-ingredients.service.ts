import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FridgeIngredient } from './fridge-ingredient.entity';
import { CreateFridgeIngredientDto } from './dto/create-fridge-ingredient.dto';
import { UpdateFridgeIngredientDto } from './dto/update-fridge-ingredient.dto';

@Injectable()
export class FridgeIngredientsService {
  constructor(
    @InjectRepository(FridgeIngredient)
    private fridgeIngredientsRepository: Repository<FridgeIngredient>,
  ) {}

  async create(createFridgeIngredientDto: CreateFridgeIngredientDto, userId: string): Promise<FridgeIngredient> {
    const ingredient = this.fridgeIngredientsRepository.create({
      ...createFridgeIngredientDto,
      userId,
    });

    return this.fridgeIngredientsRepository.save(ingredient);
  }

  async findAll(userId: string): Promise<FridgeIngredient[]> {
    return this.fridgeIngredientsRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<FridgeIngredient> {
    const ingredient = await this.fridgeIngredientsRepository.findOne({
      where: { id, userId },
    });

    if (!ingredient) {
      throw new NotFoundException(`Fridge ingredient with ID ${id} not found`);
    }

    return ingredient;
  }

  async update(id: string, updateFridgeIngredientDto: UpdateFridgeIngredientDto, userId: string): Promise<FridgeIngredient> {
    const ingredient = await this.findOne(id, userId);
    Object.assign(ingredient, updateFridgeIngredientDto);
    return this.fridgeIngredientsRepository.save(ingredient);
  }

  async remove(id: string, userId: string): Promise<void> {
    const ingredient = await this.findOne(id, userId);
    await this.fridgeIngredientsRepository.remove(ingredient);
  }

  async addMultiple(ingredients: CreateFridgeIngredientDto[], userId: string): Promise<FridgeIngredient[]> {
    const fridgeIngredients = ingredients.map(ingredient => 
      this.fridgeIngredientsRepository.create({
        ...ingredient,
        userId,
      })
    );

    return this.fridgeIngredientsRepository.save(fridgeIngredients);
  }

  async checkExpiredIngredients(userId: string): Promise<FridgeIngredient[]> {
    const today = new Date();
    return this.fridgeIngredientsRepository
      .createQueryBuilder('ingredient')
      .where('ingredient.userId = :userId', { userId })
      .andWhere('ingredient.expiryDate <= :today', { today })
      .andWhere('ingredient.isExpired = :isExpired', { isExpired: false })
      .getMany();
  }

  async markAsExpired(id: string, userId: string): Promise<FridgeIngredient> {
    const ingredient = await this.findOne(id, userId);
    ingredient.isExpired = true;
    return this.fridgeIngredientsRepository.save(ingredient);
  }
} 