# Cook Mate 🍳

A full-stack mobile cooking companion app built with Expo React Native and NestJS.

## 🚀 Project Structure

```
cook-mate/
├── mobile/          # Expo React Native mobile app
├── backend/         # NestJS REST API
├── package.json     # Root package.json with workspace scripts
└── README.md        # This file
```

## 🛠️ Tech Stack

### Mobile App (Expo React Native)
- **Framework**: Expo with React Native
- **Language**: TypeScript
- **Navigation**: React Navigation v6
- **State Management**: TanStack Query (React Query)
- **UI Library**: React Native Paper
- **HTTP Client**: Axios
- **Forms**: React Hook Form

### Backend API (NestJS)
- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: MySQL with TypeORM
- **Authentication**: JWT with Passport
- **Validation**: Class Validator
- **Documentation**: Swagger (planned)

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MySQL database
- Expo CLI: `npm install -g @expo/cli`

### Installation

1. **Clone and install dependencies**
   ```bash
   git clone <your-repo-url>
   cd cook-mate
   npm run install:all
   ```

2. **Set up the database**
   - Create a MySQL database named `cook_mate`
   - Copy `backend/.env.example` to `backend/.env`
   - Update database credentials in `backend/.env`

3. **Start both services**
   ```bash
   npm run dev
   ```

This will start:
- Mobile app on Expo development server
- Backend API on http://localhost:3000

## 📱 Mobile App Development

### Available Scripts
```bash
# Start Expo development server
npm run mobile:start

# Run on specific platforms
npm run mobile:android
npm run mobile:ios
npm run mobile:web

# Install mobile dependencies
npm run mobile:install
```

### Mobile App Features
- **Navigation**: Tab-based navigation with Home, Profile, and Settings
- **API Integration**: Pre-configured Axios client with interceptors
- **State Management**: TanStack Query setup for server state
- **UI Components**: React Native Paper for consistent design
- **TypeScript**: Full type safety throughout the app

## 🔧 Backend API Development

### Available Scripts
```bash
# Start in development mode (with hot reload)
npm run backend:dev

# Start in production mode
npm run backend:start

# Build for production
npm run backend:build

# Install backend dependencies
npm run backend:install
```

### Backend Features
- **Authentication**: JWT-based authentication system
- **Database**: TypeORM with MySQL integration
- **Validation**: Request validation with class-validator
- **Security**: Password hashing with bcrypt
- **Environment Config**: Centralized configuration management

### API Endpoints
- `GET /users` - Get all users
- `POST /users` - Create a new user
- `GET /users/:id` - Get user by ID
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user

## 🗄️ Database Setup

1. **Create MySQL database**
   ```sql
   CREATE DATABASE cook_mate;
   ```

2. **Configure environment variables**
   Create `backend/.env` with:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USERNAME=root
   DB_PASSWORD=your_password
   DB_NAME=cook_mate
   JWT_SECRET=your-secret-key
   ```

3. **Database will auto-sync in development mode**

## 🔐 Environment Variables

### Backend (.env)
```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=password
DB_NAME=cook_mate

# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=24h

# App
NODE_ENV=development
PORT=3000
```

## 📂 Project Architecture

### Mobile App Structure
```
mobile/src/
├── components/     # Reusable UI components
├── screens/       # Screen components
├── navigation/    # Navigation configuration
├── services/      # API services and utilities
├── types/         # TypeScript type definitions
└── utils/         # Helper functions
```

### Backend Structure
```
backend/src/
├── auth/          # Authentication module
├── users/         # User management module
├── config/        # Configuration files
├── common/        # Shared utilities
│   ├── guards/    # Route guards
│   ├── decorators/ # Custom decorators
│   ├── filters/   # Exception filters
│   └── pipes/     # Validation pipes
└── main.ts        # Application entry point
```

## 🚀 Deployment

### Mobile App
- **Expo**: Build and deploy using Expo Application Services (EAS)
- **App Stores**: Submit to Google Play Store and Apple App Store

### Backend API
- **Production**: Deploy to cloud services (AWS, Heroku, DigitalOcean)
- **Database**: Use managed MySQL service
- **Environment**: Set production environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 Development Notes

- The mobile app uses Expo for easy development and deployment
- Backend uses NestJS decorators (ensure `experimentalDecorators` is enabled)
- Database synchronization is enabled in development mode
- CORS is configured for mobile app development

## 📄 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues
1. **Module not found errors**: Run `npm run install:all`
2. **Database connection**: Check MySQL service and credentials
3. **Expo issues**: Try `expo doctor` for diagnostics
4. **TypeScript errors**: Ensure all dependencies are installed

### Getting Help
- Check the documentation for Expo and NestJS
- Review the project structure and configuration files
- Ensure all prerequisites are installed 