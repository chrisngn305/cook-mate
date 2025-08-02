import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Recipe } from './recipe.entity';
import { RecipeIngredient } from './recipe-ingredient.entity';
import { RecipeStep } from './recipe-step.entity';
import { RecipeTag } from './recipe-tag.entity';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';

@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(Recipe)
    private recipesRepository: Repository<Recipe>,
    @InjectRepository(RecipeIngredient)
    private ingredientsRepository: Repository<RecipeIngredient>,
    @InjectRepository(RecipeStep)
    private stepsRepository: Repository<RecipeStep>,
    @InjectRepository(RecipeTag)
    private tagsRepository: Repository<RecipeTag>,
  ) {}

  async create(createRecipeDto: CreateRecipeDto, userId: string): Promise<Recipe> {
    const recipe = this.recipesRepository.create({
      ...createRecipeDto,
      userId,
    });

    const savedRecipe = await this.recipesRepository.save(recipe);

    // Save ingredients
    if (createRecipeDto.ingredients) {
      const ingredients = createRecipeDto.ingredients.map(ingredient => 
        this.ingredientsRepository.create({
          ...ingredient,
          recipeId: savedRecipe.id,
        })
      );
      await this.ingredientsRepository.save(ingredients);
    }

    // Save steps
    if (createRecipeDto.steps) {
      const steps = createRecipeDto.steps.map(step => 
        this.stepsRepository.create({
          ...step,
          recipeId: savedRecipe.id,
        })
      );
      await this.stepsRepository.save(steps);
    }

    // Add tags if provided
    if (createRecipeDto.tagIds && createRecipeDto.tagIds.length > 0) {
      const tags = await this.tagsRepository.find({
        where: { id: In(createRecipeDto.tagIds) },
      });
      savedRecipe.tags = tags;
      await this.recipesRepository.save(savedRecipe);
    }

    return this.findOne(savedRecipe.id);
  }

  async findAll(userId?: string, filters?: any): Promise<Recipe[]> {
    const queryBuilder = this.recipesRepository
      .createQueryBuilder('recipe')
      .leftJoinAndSelect('recipe.user', 'user')
      .leftJoinAndSelect('recipe.ingredients', 'ingredients')
      .leftJoinAndSelect('recipe.steps', 'steps')
      .leftJoinAndSelect('recipe.tags', 'tags');

    if (userId) {
      queryBuilder.where('recipe.userId = :userId', { userId });
    }

    if (filters?.difficulty) {
      queryBuilder.andWhere('recipe.difficulty = :difficulty', { difficulty: filters.difficulty });
    }

    if (filters?.cookingTime) {
      queryBuilder.andWhere('recipe.cookingTime <= :cookingTime', { cookingTime: filters.cookingTime });
    }

    if (filters?.cuisine) {
      queryBuilder.andWhere('recipe.cuisine = :cuisine', { cuisine: filters.cuisine });
    }

    if (filters?.search) {
      queryBuilder.andWhere('recipe.title LIKE :search OR recipe.description LIKE :search', {
        search: `%${filters.search}%`,
      });
    }

    return queryBuilder.getMany();
  }

  async findOne(id: string): Promise<Recipe> {
    const recipe = await this.recipesRepository.findOne({
      where: { id },
      relations: ['user', 'ingredients', 'steps', 'tags'],
    });

    if (!recipe) {
      throw new NotFoundException(`Recipe with ID ${id} not found`);
    }

    return recipe;
  }

  async update(id: string, updateRecipeDto: UpdateRecipeDto, userId: string): Promise<Recipe> {
    const recipe = await this.findOne(id);

    if (recipe.userId !== userId) {
      throw new NotFoundException('You can only update your own recipes');
    }

    Object.assign(recipe, updateRecipeDto);

    // Update ingredients if provided
    if (updateRecipeDto.ingredients) {
      await this.ingredientsRepository.delete({ recipeId: id });
      const ingredients = updateRecipeDto.ingredients.map(ingredient => 
        this.ingredientsRepository.create({
          ...ingredient,
          recipeId: id,
        })
      );
      await this.ingredientsRepository.save(ingredients);
    }

    // Update steps if provided
    if (updateRecipeDto.steps) {
      await this.stepsRepository.delete({ recipeId: id });
      const steps = updateRecipeDto.steps.map(step => 
        this.stepsRepository.create({
          ...step,
          recipeId: id,
        })
      );
      await this.stepsRepository.save(steps);
    }

    // Update tags if provided
    if (updateRecipeDto.tagIds) {
      const tags = await this.tagsRepository.find({
        where: { id: In(updateRecipeDto.tagIds) },
      });
      recipe.tags = tags;
    }

    return this.recipesRepository.save(recipe);
  }

  async remove(id: string, userId: string): Promise<void> {
    const recipe = await this.findOne(id);

    if (recipe.userId !== userId) {
      throw new NotFoundException('You can only delete your own recipes');
    }

    await this.recipesRepository.remove(recipe);
  }

  async findByIngredients(ingredientNames: string[]): Promise<Recipe[]> {
    const queryBuilder = this.recipesRepository
      .createQueryBuilder('recipe')
      .leftJoinAndSelect('recipe.ingredients', 'ingredients')
      .leftJoinAndSelect('recipe.steps', 'steps')
      .leftJoinAndSelect('recipe.tags', 'tags');

    ingredientNames.forEach((ingredient, index) => {
      queryBuilder.andWhere(`ingredients.name LIKE :ingredient${index}`, {
        [`ingredient${index}`]: `%${ingredient}%`,
      });
    });

    return queryBuilder.getMany();
  }

  async incrementViews(id: string): Promise<void> {
    await this.recipesRepository.increment({ id }, 'views', 1);
  }

  async incrementLikes(id: string): Promise<void> {
    await this.recipesRepository.increment({ id }, 'likes', 1);
  }
} 