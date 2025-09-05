# iFound - Frontend Web Application

A modern React web application for tracking and managing your home medicine inventory.

## 🚀 Features

- **Modern Tech Stack**: React 18, TypeScript, Vite
- **Routing**: TanStack Router for type-safe routing
- **Styling**: TailwindCSS for responsive design
- **Forms**: React Hook Form with Zod validation
- **State Management**: TanStack Query for server state
- **Authentication**: JWT-based auth with secure storage
- **Mobile-First**: Responsive design that works on all devices

## 📦 Tech Stack

- **React 18** with TypeScript
- **Vite** - Fast build tool and dev server
- **TanStack Router** - Type-safe routing
- **TanStack Query** - Server state management
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **TailwindCSS** - Utility-first CSS
- **Axios** - HTTP client
- **Lucide React** - Beautiful icons

## 🛠️ Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

The app will be available at `http://localhost:3001`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎯 Getting Started

1. **Start the backend API** (from `/api` folder):

   ```bash
   npm run dev
   ```

2. **Start the frontend** (from `/web` folder):

   ```bash
   npm run dev
   ```

3. **Open your browser**: `http://localhost:3001`

4. **Login with demo credentials**:
   - Email: `test@test.com`
   - Password: `Test123!!!`

5. **Start managing your medicines!**

The app is fully functional with a clean, modern interface that works great on both mobile and desktop devices.

## 🗂️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.tsx      # Main app layout
│   ├── MedicineCard.tsx # Medicine display card
│   └── MedicineForm.tsx # Medicine add/edit form
├── hooks/              # Custom React hooks
│   ├── useAuth.tsx     # Authentication hook
│   └── useMedicines.ts # Medicine data hooks
├── lib/                # Utility libraries
│   ├── api.ts          # API client configuration
│   └── auth.tsx        # Auth context provider
├── routes/             # App routes (TanStack Router)
│   ├── __root.tsx      # Root layout route
│   ├── index.tsx       # Dashboard page
│   ├── login.tsx       # Login page
│   ├── register.tsx    # Register page
│   └── medicines/      # Medicine-related routes
│       ├── index.tsx   # Medicine list page
│       └── new.tsx     # Add medicine page
└── types/              # TypeScript type definitions
    └── index.ts        # Shared types
```

## 🔌 API Integration

The frontend connects to the iFound API backend:

- **Base URL**: `http://localhost:3000`
- **Authentication**: JWT tokens stored in localStorage
- **Auto-retry**: Automatic token refresh and error handling
