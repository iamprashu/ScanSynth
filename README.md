# ScanSynth - Ethical Hacking Application

A modern, full-stack ethical hacking application built with React and Node.js, featuring advanced network scanning capabilities and AI-powered vulnerability analysis.

## 🚀 Features

- **Advanced Network Scanning**: Quick, full, and stealth scan modes
- **AI-Powered Analysis**: Intelligent vulnerability assessment and recommendations
- **Real-time Results**: Live scan progress and detailed reporting
- **PDF Reports**: Professional vulnerability reports with export functionality
- **User Management**: Secure authentication with Clerk
- **Scan History**: Comprehensive history with search and filtering
- **Modern UI**: Cyberpunk-themed interface with smooth animations

## 🛠️ Technology Stack

### Frontend

- **React 18** with Vite
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Clerk** for authentication
- **React Router** for navigation
- **React Hot Toast** for notifications

### Backend

- **Node.js** with Express
- **Prisma** ORM with PostgreSQL
- **Clerk Backend** for authentication
- **Security Headers** with Helmet
- **Rate Limiting** for API protection
- **Input Validation** with Joi

## 📁 Project Structure

```
ScanSynth/
├── src/
│   ├── components/          # React components
│   ├── contexts/           # React contexts (API, UI)
│   ├── pages/              # Page components
│   ├── routes/             # Routing configuration
│   ├── config/             # Configuration files
│   └── utils/              # Utility functions
├── ScanSynth-server/       # Backend application
└── PROJECT_REPORT.txt      # Detailed project documentation
```

## 🔧 Setup Instructions

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Clerk account for authentication

### Frontend Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env` file:
   ```env
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
   VITE_BACKEND_URL=http://localhost:3001
   ```
4. Start development server:
   ```bash
   npm run dev
   ```

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd ScanSynth-server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/scansynth
   CLERK_SECRET_KEY=your_clerk_secret
   ```
4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```
5. Start the server:
   ```bash
   npm run dev
   ```

## 🔌 API Integration

The application uses a unified API context system for all backend communication:

### API Context Features

- **Centralized Management**: All API calls go through a single context
- **Authentication**: Automatic token handling with Clerk
- **Loading States**: Integrated loading management
- **Error Handling**: Comprehensive error processing
- **Modular Design**: Organized by functionality (user, scan, history)

### Available API Endpoints

- **User Management**: Create, profile, update
- **Scan Management**: Start, status, results, AI analysis
- **History Management**: List, details, delete, statistics, PDF export
- **Health Check**: Server status monitoring

## 🎨 UI/UX Features

### Design System

- **Cyberpunk Theme**: Dark interface with neon accents
- **Responsive Design**: Works on desktop and mobile
- **Smooth Animations**: Framer Motion powered transitions
- **Interactive Elements**: Hover effects and micro-interactions

### Components

- **Hero Section**: Animated landing page with matrix effects
- **Dashboard**: Main application interface
- **Scan Form**: Target input with scan type selection
- **History View**: Paginated scan history with filtering
- **Results Display**: Detailed scan results and AI analysis

## 🔒 Security Features

### Frontend Security

- **Input Validation**: Client-side validation for all inputs
- **XSS Prevention**: Sanitized data rendering
- **Authentication**: Secure token management
- **Error Handling**: Safe error message display

### Backend Security

- **Command Injection Protection**: Input sanitization
- **Rate Limiting**: API abuse prevention
- **Security Headers**: Comprehensive header protection
- **Input Validation**: Server-side validation with Joi
- **Authentication**: Clerk-based secure authentication

## 📊 Performance Optimizations

- **API Efficiency**: Request deduplication and caching
- **Component Optimization**: Memoized components and hooks
- **Bundle Optimization**: Code splitting and lazy loading
- **Loading States**: Non-blocking user interface

## 🧪 Testing

### Manual Testing Checklist

- [ ] User registration and login
- [ ] Network scan initiation
- [ ] Scan history viewing
- [ ] Search and filtering functionality
- [ ] Pagination controls
- [ ] PDF report generation
- [ ] Scan deletion
- [ ] Error handling scenarios
- [ ] Loading state verification

## 📈 Future Enhancements

- **Offline Support**: Service worker implementation
- **Advanced Caching**: Request/response caching
- **Retry Mechanisms**: Automatic retry for failed requests
- **Analytics**: User behavior tracking
- **Real-time Updates**: WebSocket integration
- **Mobile App**: React Native version

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.


