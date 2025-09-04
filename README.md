# Admin Dashboard - Ambitious Capital

A modern, responsive trading dashboard built with React, TypeScript, Tailwind CSS, and Vite. This application provides a comprehensive interface for trading account management, KYC verification, deposits, transfers, and more.

![Dashboard Preview](https://via.placeholder.com/800x400?text=Dashboard+Preview)

## 🚀 Features

### Authentication & Security
- **Secure Login System** - Email/password authentication with form validation
- **Two-Factor Authentication (2FA)** - Enhanced security with authenticator app support
- **Protected Routes** - Authenticated access to dashboard features

### Account Management
- **Live Trading Accounts** - View and manage multiple trading accounts
- **Account Creation** - Create new demo or live trading accounts
- **Account Statistics** - Real-time balance and performance metrics

### Financial Operations
- **Multi-Method Deposits** - Bank transfer, USDT, and cryptocurrency deposits
- **Internal Transfers** - Transfer funds between accounts instantly
- **Transaction History** - Comprehensive transaction tracking

### Verification & Compliance
- **KYC Verification** - Complete identity verification process
- **Document Upload** - Secure document management system
- **Verification Status Tracking** - Real-time status updates

### Business Features
- **IB Request System** - Introducing Broker application process
- **Dashboard Analytics** - Trading performance and market overview
- **Responsive Design** - Mobile-first responsive interface

## 🛠 Tech Stack

- **Frontend Framework:** React 19 with TypeScript
- **Build Tool:** Vite 7
- **Styling:** Tailwind CSS 4
- **Routing:** React Router DOM
- **Form Management:** Formik with Yup validation
- **API Client:** Axios
- **Mock API:** JSON Server
- **Icons:** Lucide React
- **UI Components:** Custom components with Radix UI primitives

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (Button, Input, Card)
│   └── layout/         # Layout components (Sidebar, Header)
├── pages/              # Route components
│   ├── LoginPage.tsx
│   ├── Dashboard.tsx
│   ├── LiveAccounts.tsx
│   ├── TradingAccountCreation.tsx
│   ├── KYCVerification.tsx
│   ├── Deposits.tsx
│   ├── InternalTransfer.tsx
│   ├── IBRequest.tsx
│   └── TwoFactorAuth.tsx
├── layouts/            # Page layouts
│   └── DashboardLayout.tsx
├── services/           # API services
│   └── api.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── utils/              # Utility functions
│   └── cn.ts
└── App.tsx             # Main app component
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- Modern web browser

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the development servers**
   ```bash
   # Start both API server and development server
   npm run dev:all
   
   # Or start them separately:
   npm run json-server  # API server (port 3001)
   npm run dev          # Development server (port 5173)
   ```

3. **Open your browser**
   - Application: http://localhost:5173
   - API Server: http://localhost:3001

### Demo Credentials
- **Email:** demo@ambitious.com
- **Password:** password123

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop** - Full sidebar navigation and detailed views
- **Tablet** - Adaptive layout with collapsible sidebar
- **Mobile** - Mobile-first design with drawer navigation

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run json-server` - Start mock API server
- `npm run dev:all` - Start both API and dev servers

### Code Architecture

#### Component Design Principles
- **DRY (Don't Repeat Yourself)** - Reusable components with props
- **Single Responsibility** - Each component handles one feature
- **Code Splitting** - Organized by feature and functionality

#### API Integration
- **Axios Configuration** - Centralized API client with interceptors
- **Error Handling** - Consistent error handling across requests
- **Type Safety** - Full TypeScript integration

## 🎨 UI/UX Features

### Design System
- **Consistent Spacing** - Tailwind CSS utility classes
- **Color Palette** - Professional green and gray theme
- **Typography** - Clear hierarchy and readability
- **Interactive Elements** - Hover states and transitions

### User Experience
- **Loading States** - Skeleton screens and spinners
- **Error Handling** - User-friendly error messages
- **Form Validation** - Real-time validation with clear feedback
- **Success States** - Confirmation messages and visual feedback

## 🔒 Security Features

- **Input Validation** - Client and server-side validation
- **Authentication Guards** - Protected route components
- **Token Management** - Secure token storage and refresh

## 📊 Mock Data

The application uses JSON Server with realistic mock data:
- User accounts and profiles
- Trading accounts with balances
- Transaction history
- KYC documents
- IB requests
- Dashboard statistics

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

---

Built with ❤️ for Ambitious Capital Limited
