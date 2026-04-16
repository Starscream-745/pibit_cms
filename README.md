# PIBIT.AI CMS

A lightweight Content Management System for managing digital assets using manually provided URLs. Built for PIBIT.AI with a modern tech stack and beautiful UI.

## 🚀 Features

- **Asset Management**: Full CRUD operations for digital assets
- **Category Organization**: Group and filter assets by categories
- **URL-Based**: Manage assets via manually provided URLs
- **🆕 Drag & Drop Upload**: Upload files directly with drag-and-drop
- **MongoDB File Storage**: Files stored in MongoDB GridFS (no external services needed)
- **Auto URL Generation**: Automatically get download URLs from uploaded files
- **Public Logos Page**: Dedicated page for public logo downloads
- **Modern UI**: Built with React and PIBIT.AI brand guidelines
- **LAN Access**: Designed for internal network use
- **Fast & Responsive**: Optimized performance with MongoDB indexing

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **React Router** for navigation
- **Vite** for fast development and building
- **CSS3** with PIBIT.AI brand colors and typography

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **MongoDB** for data persistence
- **GridFS** for file storage in MongoDB
- **Validator** for input validation and sanitization
- **Multer** for file handling

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **MongoDB** (v6 or higher)

## 🔧 Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd cms_pibit_react
```

### 2. Install dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Configure environment variables

**Backend** (`.env` in `backend/` directory):
```env
PORT=3000
NODE_ENV=development
DATABASE_URL=mongodb://localhost:27017/pibit-cms
CORS_ORIGIN=*
```

**Frontend** (`.env` in `frontend/` directory):
```env
VITE_API_URL=http://localhost:3000
```

**Note**: File upload works automatically with MongoDB GridFS - no additional setup needed!

### 4. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# On Windows (if installed as service)
net start MongoDB

# On macOS/Linux
mongod
```

## 🚀 Running the Application

### Development Mode

**Terminal 1 - Start Backend:**
```bash
cd backend
npm run dev
```

The backend will start on `http://localhost:3000`

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:5173`

### Production Mode

**Build the application:**
```bash
# Build backend
cd backend
npm run build

# Build frontend
cd ../frontend
npm run build
```

**Run in production:**
```bash
# Start backend
cd backend
npm start

# Serve frontend (use a static file server)
cd ../frontend
npm run preview
```

## 📡 API Endpoints

### Assets

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/assets` | Get all assets |
| GET | `/api/assets/:id` | Get asset by ID |
| GET | `/api/assets/category/:category` | Get assets by category |
| POST | `/api/assets` | Create new asset |
| PUT | `/api/assets/:id` | Update asset |
| DELETE | `/api/assets/:id` | Delete asset |

### Categories

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | Get all unique categories |

### File Upload (MongoDB GridFS)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/upload` | Upload file to MongoDB |
| GET | `/api/files/:fileId` | Download file from MongoDB |
| GET | `/api/status` | Check upload service status |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Server health status |

## 📝 API Request Examples

### Create Asset

```bash
POST /api/assets
Content-Type: application/json

{
  "name": "Company Logo",
  "url": "https://example.com/logo.png",
  "category": "Images",
  "description": "Main company logo"
}
```

### Update Asset

```bash
PUT /api/assets/:id
Content-Type: application/json

{
  "name": "Updated Logo",
  "description": "Updated description"
}
```

## 🎨 Brand Guidelines

The UI follows PIBIT.AI brand guidelines:

### Colors
- **Tech Blue** (#0684F0) - Primary brand color
- **Celestial Blue** (#29A0F3) - CTAs and highlights
- **Jet Black** (#383838) - Primary text
- **Cloud White** (#FFFFFF) - Backgrounds

### Typography
- **Headings**: Space Grotesk
- **Body Text**: Inter

## 📁 Project Structure

```
cms_pibit_react/
├── backend/
│   ├── src/
│   │   ├── config/          # Database configuration
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Express middleware
│   │   ├── models/          # Data models
│   │   ├── repositories/    # Data access layer
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Utilities
│   │   └── server.ts        # Entry point
│   ├── .env                 # Environment variables
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── styles/          # CSS files
│   │   ├── types/           # TypeScript types
│   │   ├── App.tsx          # Main app component
│   │   └── main.tsx         # Entry point
│   ├── .env                 # Environment variables
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
└── README.md
```

## 🧪 Testing

```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test
```

## 🔒 Security

- **Input Sanitization**: All user inputs are sanitized to prevent XSS attacks
- **URL Validation**: URLs are validated before storage
- **LAN-Only Access**: Designed for internal network use
- **No Authentication**: Suitable for trusted internal environments

## 🚀 Deployment

### LAN Deployment

1. Build both frontend and backend
2. Configure environment variables for production
3. Set `NODE_ENV=production`
4. Ensure MongoDB is accessible
5. Start the backend server
6. Serve the frontend build folder

### Network Access

To make the application accessible on your LAN:

1. Find your local IP address:
   ```bash
   # Windows
   ipconfig
   
   # macOS/Linux
   ifconfig
   ```

2. Update backend to listen on all interfaces (in `server.ts`):
   ```typescript
   app.listen(PORT, '0.0.0.0', () => { ... });
   ```

3. Access from other devices:
   - Backend: `http://<your-ip>:3000`
   - Frontend: `http://<your-ip>:5173`

## 📄 License

Copyright © 2026 PIBIT.AI

## 🤝 Support

For issues or questions, please contact the PIBIT.AI development team.

---

**Built with ❤️ by PIBIT.AI**
