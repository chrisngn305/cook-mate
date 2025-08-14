import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { RecipesService } from './recipes.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { AuthGuard } from '@nestjs/passport';
import { FileUploadService } from '../common/services/file-upload.service';

@Controller('recipes')
export class RecipesController {
  constructor(
    private readonly recipesService: RecipesService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createRecipeDto: CreateRecipeDto, @Request() req) {
    return this.recipesService.create(createRecipeDto, req.user.id);
  }

  @Get()
  findAll(@Query() filters: any) {
    return this.recipesService.findAll(undefined, filters);
  }

  @Get('my-recipes')
  @UseGuards(AuthGuard('jwt'))
  findMyRecipes(@Request() req, @Query() filters: any) {
    return this.recipesService.findAll(req.user.id, filters);
  }

  @Get('search-by-ingredients')
  @UseGuards(AuthGuard('jwt'))
  findByIngredients(@Query('ingredients') ingredients: string) {
    const ingredientNames = ingredients.split(',').map(i => i.trim());
    return this.recipesService.findByIngredients(ingredientNames);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recipesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() updateRecipeDto: UpdateRecipeDto, @Request() req) {
    return this.recipesService.update(id, updateRecipeDto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string, @Request() req) {
    return this.recipesService.remove(id, req.user.id);
  }

  @Post(':id/view')
  incrementViews(@Param('id') id: string) {
    return this.recipesService.incrementViews(id);
  }

  @Post(':id/like')
  @UseGuards(AuthGuard('jwt'))
  incrementLikes(@Param('id') id: string) {
    return this.recipesService.incrementLikes(id);
  }

  @Post(':id/image')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('image'))
  async uploadRecipeImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ) {
    // Upload the image
    const imagePath = await this.fileUploadService.uploadRecipeImage(file);
    
    // Update the recipe with the new image path
    const updatedRecipe = await this.recipesService.update(id, { image: imagePath }, req.user.id);
    
    return {
      message: 'Recipe image uploaded successfully',
      image: imagePath,
      recipe: updatedRecipe,
    };
  }
} 