# AmplifyShift Application Architecture

## Overview

This document outlines the low-level architecture and data flow of the AmplifyShift application, a healthcare staffing platform built with Django (backend) and React (frontend).

## Backend (Django) Architecture

### Core Components
```
backend/
├── amplifyshift/          # Project settings & configuration
│   ├── settings.py        # Main settings (DB, Auth, etc.)
│   ├── urls.py           # Main URL routing
│   └── database_config.py # Database connection setup
├── professional/          # Professional/Worker management
├── facility/             # Healthcare facility management
├── jobs/                 # Job postings and management
├── contract/             # Contract handling
└── membership/           # User membership & subscriptions
```

### Data Flow
1. Request Flow:
   - Client makes HTTP request
   - Django URL Router processes request
   - View handles business logic
   - Serializer transforms data
   - Model interacts with database
   - Database returns data
   - Response flows back through Model → Serializer → JSON → Client

2. Authentication Flow:
   - Uses Django's token-based authentication
   - User logs in → Server validates credentials → Returns auth token
   - Subsequent requests include token in header

## Frontend (React) Architecture

### Build System
```
frontend/
├── webpack.config.js     # Bundling & build configuration
├── src/
│   ├── index.js         # Application entry point
│   ├── components/      # Reusable UI components
│   ├── pages/          # Main application pages
│   └── redux/          # State management
└── public/             # Static assets
```

### Component Flow
- React components handle UI rendering
- Redux manages application state
- Axios handles API calls to backend

## API Integration Flow

### Authentication
```
Frontend → POST /api/auth/login → Backend validates → Returns token
```

### Data Operations
```
Frontend (React) ─────► Backend (Django REST API) ─────► Database (MySQL)
     ▲                         │                            │
     └─────────────────────────┴───────────────────────────┘
         JSON Response         Data Retrieval
```

## Database Schema

### Key Tables and Relationships
```sql
# Professional (healthcare workers)
├── id
├── user (1-1 with Django User)
└── qualifications

# Facility (healthcare facilities)
├── id
├── name
└── location

# Jobs
├── id
├── facility (FK)
├── requirements
└── status

# Contracts
├── id
├── professional (FK)
├── facility (FK)
└── status
```

## Security Flow

### Request Security Chain
```
Client Request → CORS Check → CSRF Validation → Token Auth → Permission Check → View
```

### Security Measures
- Database credentials stored in .env
- Token-based API authentication
- CORS configuration for frontend access

## Development Server Flow

### Backend (Django)
```
python manage.py runserver
↓
Django loads settings
↓
Database connection established
↓
URL patterns registered
↓
Server listens on :8000
```

### Frontend (Webpack)
```
npm run dev
↓
Webpack loads config
↓
Bundles JS/CSS
↓
Dev server starts on :3001
↓
Hot Module Replacement enabled
```

## API Routes Structure
```
/api/
├── professional/         # Professional endpoints
│   ├── GET /            # List professionals
│   └── POST /           # Register professional
├── facility/            # Facility endpoints
│   ├── GET /            # List facilities
│   └── POST /           # Create facility
├── jobs/                # Job endpoints
└── contracts/           # Contract endpoints
```

## Key Dependencies

### Backend
- Django 4.2.11 (Web framework)
- Django REST framework (API)
- PyMySQL (Database connector)
- django-rq (Background tasks)

### Frontend
- React 18.2.0 (UI library)
- Redux (State management)
- Webpack (Bundling)
- Sass (Styling)

## Architecture Benefits
1. Scalable and modular development
2. Clear separation of concerns
3. Secure data handling
4. Efficient state management
5. Fast development iterations

## Development Setup

### Backend Setup
1. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
2. Configure environment variables in .env
3. Run migrations:
   ```bash
   python manage.py migrate
   ```
4. Start development server:
   ```bash
   python manage.py runserver
   ```

### Frontend Setup
1. Install Node.js dependencies:
   ```bash
   npm install
   ```
2. Start development server:
   ```bash
   npm run dev
   ```

## Server Configuration
- Backend runs on http://localhost:8000
- Frontend runs on http://localhost:3001
- API endpoints accessible at http://localhost:8000/api/
