# iFound - Medicine Location Tracker

A full-stack application to help users track and locate their medicines with AI-powered search capabilities.

## 🎯 Product Overview

**iFound** is a medicine location tracking application that allows users to:

- Register and securely store information about where they keep their medicines
- Use AI to avoid duplicate entries and enhance search capabilities
- Find medicines quickly with advanced filtering and search options
- Manage their medicine inventory with full CRUD operations

## 🏗️ Architecture

```
ifound/
├── api/          # Backend API (Fastify + Node.js)
├── app/          # Mobile App (React Native + Expo)
└── shared/       # Shared types and utilities (optional)
```

## 🚀 Features

### User Management

- **Authentication**: Login and register functionality
- **Security**: JWT-based authentication
- **Profile**: User profile management

### Medicine Management

- **Register**: Add new medicines with location details
- **AI Validation**: Check for existing similar medicines before adding
- **List & Filter**: View all medicines with sorting and filtering options
- **Search**:
  - Text-based search
  - AI-powered semantic search
  - Location-based filtering
- **Details**: View comprehensive medicine information
- **Edit**: Update medicine information and location
- **Delete**: Remove medicines from inventory

## 🛠️ Technology Stack

### Backend (API)

- **Framework**: Fastify (Fast, low overhead web framework)
- **Database ORM**: Drizzle ORM (TypeScript-first ORM)
- **Validation**: Zod (TypeScript schema validation)
- **Authentication**: Simple JWT implementation
- **AI Integration**: OpenAI API or similar for medicine validation and search
- **Additional Libraries**:
  - `@fastify/cors` - CORS support
  - `@fastify/helmet` - Security headers
  - `@fastify/rate-limit` - Rate limiting
  - `dotenv` - Environment configuration
  - `bcrypt` - Password hashing

### Mobile App

- **Framework**: React Native with Expo
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Validation**: Zod (Schema validation)
- **Navigation**: Expo Router or React Navigation
- **State Management**: Zustand or React Query
- **Animations**:
  - React Native Reanimated 3
  - Lottie React Native
  - React Native Gesture Handler
- **UI Components**:
  - NativeBase or React Native Elements
  - React Native Paper (Material Design)
- **Additional Libraries**:
  - `expo-secure-store` - Secure token storage
  - `expo-image` - Optimized image component
  - `react-hook-form` - Form management

### Database

- **Development**: SQLite (with Drizzle)
- **Production**: PostgreSQL (recommended)

## 📋 Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- Git

### Backend Setup (API)

1. **Navigate to API directory**

   ```bash
   cd api
   ```

2. **Initialize Node.js project**

   ```bash
   npm init -y
   ```

3. **Install dependencies**

   ```bash
   # Core dependencies
   npm install fastify @fastify/cors @fastify/helmet @fastify/rate-limit
   npm install drizzle-orm drizzle-kit
   npm install zod
   npm install jsonwebtoken bcrypt
   npm install dotenv
   npm install openai  # or your preferred AI service

   # Database driver (choose one)
   npm install better-sqlite3  # for SQLite
   # npm install pg @types/pg  # for PostgreSQL

   # Development dependencies
   npm install -D typescript @types/node @types/jsonwebtoken @types/bcrypt
   npm install -D tsx nodemon
   ```

4. **Create project structure**

   ```bash
   mkdir -p src/{routes,services,middleware,types,db}
   touch src/index.ts
   touch src/db/schema.ts
   touch src/db/index.ts
   touch .env
   touch .env.example
   ```

5. **Setup TypeScript configuration**

   ```bash
   npx tsc --init
   ```

6. **Configure environment variables**

   ```bash
   # Copy example env file and fill with your values
   cp .env.example .env
   ```

7. **Database setup**

   ```bash
   # Generate migration
   npx drizzle-kit generate:sqlite

   # Run migration
   npx drizzle-kit push:sqlite
   ```

### Mobile App Setup

1. **Navigate to app directory**

   ```bash
   cd app
   ```

2. **Initialize Expo project**

   ```bash
   npx create-expo-app . --template blank-typescript
   ```

3. **Install dependencies**

   ```bash
   # Core dependencies
   npx expo install expo-router expo-secure-store
   npm install zustand react-query
   npm install react-hook-form
   npm install zod

   # UI and animations
   npm install nativewind
   npx expo install react-native-reanimated react-native-gesture-handler
   npm install lottie-react-native
   npm install react-native-paper

   # Development dependencies
   npm install -D tailwindcss
   ```

4. **Configure NativeWind**
   ```bash
   npx tailwindcss init
   ```

## 🗄️ Database Schema

### Users Table

```sql
- id (Primary Key)
- email (Unique)
- password_hash
- name
- created_at
- updated_at
```

### Medicines Table

```sql
- id (Primary Key)
- user_id (Foreign Key)
- name
- description
- location
- category
- expiry_date
- quantity
- notes
- image_url (optional)
- created_at
- updated_at
```

### Medicine Categories (Optional)

```sql
- id (Primary Key)
- name
- description
```

## 🔌 API Endpoints

### Authentication

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh JWT token

### Medicines

- `GET /medicines` - List user's medicines (with filters)
- `POST /medicines` - Create new medicine
- `GET /medicines/:id` - Get medicine details
- `PUT /medicines/:id` - Update medicine
- `DELETE /medicines/:id` - Delete medicine
- `POST /medicines/search` - AI-powered search
- `POST /medicines/validate` - Check for similar medicines

### User Profile

- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile

## 📱 App Screens

### Authentication Flow

- **Login Screen** - Email/password login
- **Register Screen** - User registration form
- **Forgot Password** - Password recovery

### Main App Flow

- **Home/Dashboard** - Overview of medicines, quick actions
- **Medicine List** - Grid/list view with search and filters
- **Add Medicine** - Form to add new medicine with AI validation
- **Medicine Details** - Detailed view with edit/delete options
- **Search** - Advanced search with AI capabilities
- **Profile** - User settings and profile management

## 🤖 AI Integration

### Medicine Validation

- Check for existing similar medicines before adding
- Suggest corrections for medicine names
- Categorize medicines automatically

### Smart Search

- Semantic search across medicine names and descriptions
- Natural language queries ("Where did I put my headache medicine?")
- Location-based suggestions

## 🎨 UI/UX Guidelines

### Design Principles

- **Clean & Minimal**: Focus on usability and clarity
- **Accessible**: Support for screen readers and high contrast
- **Consistent**: Unified design language across screens
- **Responsive**: Adapt to different screen sizes

### Color Scheme

- Primary: Medical blue (#2563EB)
- Secondary: Soft green (#10B981)
- Accent: Orange for warnings (#F59E0B)
- Neutral: Gray scale for text and backgrounds

### Animations

- **Smooth Transitions**: Between screens and states
- **Loading States**: Skeleton screens and spinners
- **Micro-interactions**: Button presses, form validation
- **Gesture Animations**: Pull-to-refresh, swipe actions

## 🧪 Testing Strategy

### Backend Testing

```bash
npm install -D vitest @vitest/ui
npm install -D supertest @types/supertest
```

### Frontend Testing

```bash
npm install -D jest @testing-library/react-native
```

## 🚀 Deployment

### Backend Deployment

- **Development**: Local with nodemon
- **Staging/Production**: Railway, Vercel, or DigitalOcean
- **Database**: PostgreSQL on Railway or Supabase

### Mobile App Deployment

- **Development**: Expo Go app
- **Testing**: Expo Development Build
- **Production**:
  - iOS: App Store via Expo Application Services (EAS)
  - Android: Google Play Store via EAS

## 📦 Build Scripts

### Backend (package.json)

```json
{
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "db:generate": "drizzle-kit generate:sqlite",
    "db:push": "drizzle-kit push:sqlite",
    "test": "vitest"
  }
}
```

### Mobile App (package.json)

```json
{
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "build:android": "eas build --platform android",
    "build:ios": "eas build --platform ios",
    "test": "jest"
  }
}
```

## 🔧 Development Workflow

1. **Start Backend**

   ```bash
   cd api && npm run dev
   ```

2. **Start Mobile App**

   ```bash
   cd app && npm start
   ```

3. **Run Tests**

   ```bash
   # Backend tests
   cd api && npm test

   # App tests
   cd app && npm test
   ```

## 🔒 Security Considerations

- **JWT Security**: Short-lived access tokens, secure refresh mechanism
- **Input Validation**: Zod schemas for all API inputs
- **Rate Limiting**: Prevent API abuse
- **CORS**: Configure appropriate origins
- **Helmet**: Security headers
- **Environment Variables**: Keep secrets secure

## 📈 Performance Optimization

### Backend

- Database indexing for search queries
- Response caching for frequent requests
- Connection pooling
- Query optimization with Drizzle

### Mobile App

- Image optimization with Expo Image
- Lazy loading for medicine lists
- Efficient state management
- Bundle splitting and code splitting

## 🐛 Debugging Tools

- **Backend**: VS Code debugger, console logging
- **Mobile**: Flipper, React Native Debugger
- **API Testing**: Postman or Thunder Client
- **Database**: Drizzle Studio

## 📚 Documentation

- API documentation with Swagger/OpenAPI
- Component documentation with Storybook (optional)
- README files for both API and app
- Environment setup guides

---

## 🚀 Quick Start Commands

```bash
# Clone and setup
git clone <your-repo>
cd ifound

# Setup backend
cd api
npm install
npm run dev

# Setup mobile app (in another terminal)
cd app
npm install
npm start
```

---

## ✅ BACKEND STATUS: COMPLETED!

The backend API has been successfully implemented and is running on **http://localhost:3002**

### What's Been Built:

✅ **Complete Project Structure**

- Fastify server with TypeScript
- Drizzle ORM with SQLite database
- Modular architecture (routes, services, middleware)

✅ **Authentication System**

- JWT-based authentication
- User registration and login
- Password hashing with bcrypt
- Protected routes middleware

✅ **Medicine Management**

- CRUD operations for medicines
- Database schema with proper relationships
- Input validation with Zod schemas

✅ **AI Integration Foundation**

- OpenAI service structure
- Medicine validation and suggestions
- Smart search capabilities (when API key provided)

✅ **Production-Ready Features**

- Environment configuration
- Error handling and logging
- Security headers (Helmet)
- CORS configuration
- Rate limiting
- Health check endpoint

### Quick Start Commands:

```bash
# Start the backend server
cd api && npm run dev

# The server will run on http://localhost:3002
# Health check: http://localhost:3002/health
```

### API Endpoints Available:

- Authentication: `/auth/register`, `/auth/login`, `/auth/me`
- Medicines: `/medicines` (GET, POST)
- Health: `/health`
- Test: `/medicines/test`

**Next Step:** Proceed with mobile app development (React Native + Expo)

---

Start building your medicine location tracker! 🏥📱
