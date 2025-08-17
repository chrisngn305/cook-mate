import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Recipe } from './recipe.entity';
import { RecipeIngredient } from './recipe-ingredient.entity';
import { RecipeStep } from './recipe-step.entity';
import { RecipeTag } from './recipe-tag.entity';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { plainToClass } from 'class-transformer';
import { CreateRecipeIngredientDto } from './dto/create-recipe.dto';

interface RecipeFilters {
  difficulty?: string;
  cookingTime?: number;
  cuisine?: string;
  search?: string;
}

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

  private async executeInTransaction<T>(
    operation: (manager: EntityManager) => Promise<T>,
  ): Promise<T> {
    const queryRunner = this.recipesRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await operation(queryRunner.manager);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async create(
    createRecipeDto: CreateRecipeDto,
    userId: string,
  ): Promise<Recipe> {
    return this.executeInTransaction(async (manager) => {
      // 1. Create recipe
      const recipe = await manager.save(Recipe, {
        ...createRecipeDto,
        userId,
        ingredients: [],
        steps: [],
        tags: [],
      });

      // 2. Create ingredients
      if (createRecipeDto.ingredients?.length > 0) {
        const ingredients = createRecipeDto.ingredients.map((ing, index) =>
          manager.create(RecipeIngredient, {
            ...ing,
            order: ing.order ?? index,
            recipe,
          }),
        );
        await manager.save(ingredients);
      }

      // 3. Create steps
      if (createRecipeDto.steps?.length > 0) {
        const steps = createRecipeDto.steps.map((step, index) =>
          manager.create(RecipeStep, {
            ...step,
            order: step.order ?? index,
            recipe,
          }),
        );
        await manager.save(steps);
      }

      // 4. Add tags
      if (createRecipeDto.tagIds && createRecipeDto.tagIds.length > 0) {
        const tags = await manager.findByIds(RecipeTag, createRecipeDto.tagIds);
        await manager.save(Recipe, {
          ...recipe,
          tags,
        });
      }

      return this.findOne(recipe.id);
    });
  }

  async update(
    id: string,
    updateRecipeDto: UpdateRecipeDto,
    userId: string,
  ): Promise<Recipe> {
    const recipe = await this.findOne(id);
    if (recipe.userId !== userId) {
      throw new NotFoundException('You can only update your own recipes');
    }

    return this.executeInTransaction(async (manager) => {
      // 1. Update recipe basic data
      const { ingredients, steps, tagIds, ...recipeData } = updateRecipeDto;
      await manager.update(Recipe, id, recipeData);

      // 2. Handle ingredients
      if (ingredients !== undefined) {
        await manager.delete(RecipeIngredient, { recipe: { id } });

        if (ingredients.length > 0) {
          // Transform ingredients to ensure proper type conversion
          const transformedIngredients = ingredients.map(ing => ({
            ...ing,
            quantity: typeof ing.quantity === 'string' ? parseFloat(ing.quantity) : ing.quantity
          }));

          // Validate transformed ingredients
          const newIngredients = transformedIngredients.map((ing, index) =>
            manager.create(RecipeIngredient, {
              ...ing,
              order: ing.order ?? index,
              recipe: { id },
            }),
          );
          await manager.save(newIngredients);
        }
      }

      // 3. Handle steps
      if (steps !== undefined) {
        await manager.delete(RecipeStep, { recipe: { id } });

        if (steps.length > 0) {
          const newSteps = steps.map((step, index) =>
            manager.create(RecipeStep, {
              ...step,
              order: step.order ?? index,
              recipe: { id },
            }),
          );
          await manager.save(newSteps);
        }
      }

      // 4. Handle tags
      if (tagIds !== undefined) {
        const updatedRecipe = await manager.findOne(Recipe, {
          where: { id },
          relations: ['tags'],
        });

        if (updatedRecipe) {
          if (tagIds.length > 0) {
            const tags = await manager.findByIds(RecipeTag, tagIds);
            await manager.save(Recipe, {
              ...updatedRecipe,
              tags,
            });
          } else {
            await manager.save(Recipe, {
              ...updatedRecipe,
              tags: [],
            });
          }
        }
      }

      return this.findOne(id);
    });
  }

  async findAll(userId?: string, filters?: RecipeFilters): Promise<Recipe[]> {
    const queryBuilder = this.recipesRepository
      .createQueryBuilder('recipe')
      .leftJoinAndSelect('recipe.user', 'user')
      .leftJoinAndSelect('recipe.ingredients', 'ingredients')
      .leftJoinAndSelect('recipe.steps', 'steps')
      .leftJoinAndSelect('recipe.tags', 'tags')
      .orderBy('ingredients.order', 'ASC')
      .addOrderBy('steps.order', 'ASC');

    if (userId) {
      queryBuilder.where('recipe.userId = :userId', { userId });
    }

    if (filters?.difficulty) {
      queryBuilder.andWhere('recipe.difficulty = :difficulty', {
        difficulty: filters.difficulty,
      });
    }

    if (filters?.cookingTime) {
      queryBuilder.andWhere('recipe.cookingTime <= :cookingTime', {
        cookingTime: filters.cookingTime,
      });
    }

    if (filters?.cuisine) {
      queryBuilder.andWhere('recipe.cuisine = :cuisine', {
        cuisine: filters.cuisine,
      });
    }

    if (filters?.search) {
      queryBuilder.andWhere(
        '(recipe.title LIKE :search OR recipe.description LIKE :search)',
        { search: `%${filters.search}%` },
      );
    }

    return queryBuilder.getMany();
  }

  async findOne(id: string): Promise<Recipe> {
    const recipe = await this.recipesRepository.findOne({
      where: { id },
      relations: {
        user: true,
        ingredients: true,
        steps: true,
        tags: true,
      },
      order: {
        ingredients: { order: 'ASC' },
        steps: { order: 'ASC' },
      },
    });

    if (!recipe) {
      throw new NotFoundException(`Recipe with ID ${id} not found`);
    }

    return recipe;
  }

  async remove(id: string, userId: string): Promise<void> {
    const recipe = await this.findOne(id);

    if (recipe.userId !== userId) {
      throw new NotFoundException('You can only delete your own recipes');
    }

    await this.executeInTransaction(async (manager) => {
      await manager.remove(recipe);
    });
  }

  async findByIngredients(ingredientNames: string[]): Promise<Recipe[]> {
    const queryBuilder = this.recipesRepository
      .createQueryBuilder('recipe')
      .leftJoinAndSelect('recipe.ingredients', 'ingredients')
      .leftJoinAndSelect('recipe.steps', 'steps')
      .leftJoinAndSelect('recipe.tags', 'tags')
      .orderBy('ingredients.order', 'ASC')
      .addOrderBy('steps.order', 'ASC');

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