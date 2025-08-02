<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

# Cook Mate Backend

A comprehensive NestJS backend for the Cook Mate recipe management application.

## Features

- **User Management**: Registration, authentication, and profile management
- **Recipe Management**: CRUD operations for recipes with ingredients and steps
- **Fridge Management**: Track available ingredients and expiry dates
- **Shopping Lists**: Create and manage shopping lists with items
- **Recipe Tags**: Categorize recipes by cuisine, difficulty, occasion, etc.
- **JWT Authentication**: Secure API endpoints with JWT tokens
- **MySQL Database**: TypeORM with MySQL for data persistence

## Database Schema

### Core Entities

1. **User** - User profiles with preferences and stats
2. **Recipe** - Main recipe entity with metadata
3. **RecipeIngredient** - Ingredients for each recipe
4. **RecipeStep** - Cooking steps with order and descriptions
5. **RecipeTag** - Categorization tags for recipes
6. **FridgeIngredient** - User's available ingredients
7. **ShoppingList** - Shopping lists
8. **ShoppingListItem** - Individual shopping items

### Relationships

- User → Recipes (One-to-Many)
- User → FridgeIngredients (One-to-Many)
- User → ShoppingLists (One-to-Many)
- Recipe → RecipeIngredients (One-to-Many)
- Recipe → RecipeSteps (One-to-Many)
- Recipe → RecipeTags (Many-to-Many)
- ShoppingList → ShoppingListItems (One-to-Many)

## Setup

### Prerequisites

- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Configuration**
   Create a `.env` file in the backend directory:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=3306
   DB_USERNAME=root
   DB_PASSWORD=your_password
   DB_NAME=cook_mate

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=7d

   # Environment
   NODE_ENV=development
   ```

3. **Database Setup**
   ```bash
   # Create MySQL database
   mysql -u root -p
   CREATE DATABASE cook_mate;
   ```

4. **Run the Application**
   ```bash
   # Development mode
   npm run start:dev

   # Production mode
   npm run build
   npm run start:prod
   ```

5. **Seed the Database**
   ```bash
   # Run the seeder to populate sample data
   npm run seed
   ```

## API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/profile` - Get user profile (protected)

### Users
- `GET /users` - Get all users (protected)
- `GET /users/profile` - Get current user profile (protected)
- `GET /users/:id` - Get user by ID (protected)
- `PATCH /users/profile` - Update current user profile (protected)
- `PATCH /users/:id` - Update user by ID (protected)
- `DELETE /users/:id` - Delete user (protected)

### Recipes
- `GET /recipes` - Get all recipes (public)
- `GET /recipes/my-recipes` - Get user's recipes (protected)
- `GET /recipes/search-by-ingredients` - Search recipes by ingredients (protected)
- `GET /recipes/:id` - Get recipe by ID (public)
- `POST /recipes` - Create new recipe (protected)
- `PATCH /recipes/:id` - Update recipe (protected)
- `DELETE /recipes/:id` - Delete recipe (protected)
- `POST /recipes/:id/view` - Increment recipe views (public)
- `POST /recipes/:id/like` - Like recipe (protected)

### Fridge Ingredients
- `GET /fridge-ingredients` - Get user's fridge ingredients (protected)
- `GET /fridge-ingredients/expired` - Get expired ingredients (protected)
- `GET /fridge-ingredients/:id` - Get ingredient by ID (protected)
- `POST /fridge-ingredients` - Add ingredient to fridge (protected)
- `POST /fridge-ingredients/multiple` - Add multiple ingredients (protected)
- `PATCH /fridge-ingredients/:id` - Update ingredient (protected)
- `PATCH /fridge-ingredients/:id/expire` - Mark ingredient as expired (protected)
- `DELETE /fridge-ingredients/:id` - Remove ingredient (protected)

### Shopping Lists
- `GET /shopping-lists` - Get user's shopping lists (protected)
- `GET /shopping-lists/:id` - Get shopping list by ID (protected)
- `POST /shopping-lists` - Create shopping list (protected)
- `POST /shopping-lists/from-recipe/:recipeId` - Generate list from recipe (protected)
- `PATCH /shopping-lists/:id` - Update shopping list (protected)
- `PATCH /shopping-lists/:id/complete` - Mark list as completed (protected)
- `DELETE /shopping-lists/:id` - Delete shopping list (protected)

### Shopping List Items
- `POST /shopping-lists/:id/items` - Add item to list (protected)
- `PATCH /shopping-lists/:id/items/:itemId` - Update item (protected)
- `PATCH /shopping-lists/:id/items/:itemId/toggle` - Toggle item completion (protected)
- `DELETE /shopping-lists/:id/items/:itemId` - Remove item (protected)

## Sample Data

The seeder creates the following sample data:

### Users
- **Chef John** (john@example.com) - Intermediate cook with Italian/Mexican preferences
- **Chef Sarah** (sarah@example.com) - Advanced cook with Asian/Mediterranean preferences

### Recipes
1. **Pasta Carbonara** - Easy Italian pasta dish
2. **Chicken Stir Fry** - Medium Asian stir fry
3. **Beef Stew** - Hard comfort food for cold days
4. **Pizza Margherita** - Medium Italian pizza
5. **Chocolate Cake** - Hard celebration dessert

### Tags
- Difficulty: Easy to Cook, Quick (< 30min)
- Occasion: Cold Day, Party
- Cuisine: Italian, Asian, Mexican
- Mood: Comfort Food, Healthy
- Season: Summer, Winter

### Fridge Ingredients
- Common ingredients like tomatoes, onions, chicken, garlic, olive oil, bread, eggs, milk, cheese, butter

### Shopping Lists
- Weekly Groceries with common items
- Party Shopping with pizza ingredients

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Development

### Available Scripts
- `npm run start:dev` - Start in development mode with hot reload
- `npm run build` - Build the application
- `npm run start:prod` - Start in production mode
- `npm run test` - Run tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

### Database Migrations
The application uses TypeORM's synchronize feature in development. For production, you should use migrations.

## Production Deployment

1. Set `NODE_ENV=production` in your environment
2. Use a proper MySQL database with SSL
3. Set a strong JWT secret
4. Use environment variables for all configuration
5. Set up proper logging and monitoring

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
