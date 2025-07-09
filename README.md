# De Canokart - E-commerce Platform

A full-stack e-commerce platform built with React and Node.js.

## 🚀 Quick Start

### Local Development
1. Clone the repository
2. Install dependencies:
   ```bash
   # Frontend
   cd frontend
   npm install
   
   # Backend
   cd ../server
   npm install
   ```
3. Set up environment variables (see .env.template files)
4. Start development servers:
   ```bash
   # Backend (Terminal 1)
   cd server
   npm run dev
   
   # Frontend (Terminal 2)
   cd frontend
   npm start
   ```

### Production Deployment
See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## 📁 Project Structure
```
proj3/
├── frontend/          # React frontend
├── server/           # Node.js backend
└── DEPLOYMENT.md     # Deployment guide
```

## 🛠️ Tech Stack
- **Frontend**: React, Tailwind CSS, DaisyUI
- **Backend**: Node.js, Express, MongoDB
- **Database**: MongoDB Atlas
- **Deployment**: Vercel (Frontend) + Railway (Backend)

## ✨ Features
- User authentication & profiles
- Product catalog with search & filters
- Shopping cart & wishlist
- Order management
- Admin panel
- Seller dashboard
- Reviews & ratings
- Responsive design

## 🔧 Environment Variables

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ENV=development
```

### Backend (.env)
```
MONGO_URL=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

## 📝 License
This project is for educational purposes.