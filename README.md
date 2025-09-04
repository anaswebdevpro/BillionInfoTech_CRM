# Billion InfoTech CRM

A professional trading platform management system built with React, TypeScript, and Vite.

## 🚀 Features

- **Secure Authentication** - JWT-based authentication with route protection
- **Dashboard Analytics** - Real-time trading metrics and performance charts
- **Account Management** - Complete trading account lifecycle management
- **KYC Verification** - Document upload and verification system
- **Support System** - Ticket-based customer support
- **Admin Panel** - Comprehensive administrative controls
- **Responsive Design** - Mobile-first responsive interface
- **Type Safety** - Full TypeScript implementation

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v7
- **Forms**: Formik + Yup validation
- **Icons**: Lucide React, React Icons
- **HTTP Client**: Axios
- **Build Tool**: Vite with SWC

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run type-check` - Run TypeScript type checking
- `npm run clean` - Clean build artifacts

## 🌍 Environment Variables

Create a `.env.local` file in the root directory:

```env
VITE_API_BASE_URL=https://amf.billioninfotech.com/api/v1
VITE_APP_NAME=Billion InfoTech CRM
VITE_APP_VERSION=1.0.0
VITE_ENABLE_LOGGING=false
VITE_ENABLE_DEV_TOOLS=false
```

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI components
│   ├── layout/         # Layout components
│   └── dashboard/      # Dashboard-specific components
├── pages/              # Page components
├── services/           # API services
├── hooks/              # Custom React hooks
├── context/            # React context providers
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── constants/          # Application constants
└── config/             # Configuration files
```

## 🔒 Security Features

- JWT token-based authentication
- Automatic token refresh
- Route protection with ProtectedRoute component
- Secure API request handling
- Input validation and sanitization
- Error boundary implementation

## 🚀 Deployment

### Production Build

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Environment Configuration

Ensure all environment variables are properly configured for your production environment.

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is proprietary software owned by Billion InfoTech.

## 🆘 Support

For technical support, please contact the development team or create a support ticket through the application.