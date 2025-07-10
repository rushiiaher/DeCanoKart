# Quick Deployment Steps

## 🚀 Deploy in 5 Minutes

### 1. Deploy Backend to Railway (2 minutes)
1. Go to [railway.app](https://railway.app)
2. Click "Deploy from GitHub repo"
3. Select your repo → Choose `server` folder
4. Add these environment variables:
   ```
   MONGO_URL=mongodb+srv://rushiaher:nijNQi2P7hytboM4@cluster0.ri4epfi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   JWT_SECRET=decanokart-super-secret-key-2024
   NODE_ENV=production
   CORS_ORIGIN=*
   ```
5. Copy your Railway URL (e.g., `https://abc123.up.railway.app`)

### 2. Deploy Frontend to Vercel (2 minutes)
1. Update `frontend/.env` with your Railway URL:
   ```
   REACT_APP_API_URL=https://YOUR-RAILWAY-URL.up.railway.app/api
   REACT_APP_ENV=production
   ```
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project" → Import from GitHub
4. Select your repo → Set root directory to `frontend`
5. Add environment variable:
   ```
   REACT_APP_API_URL=https://YOUR-RAILWAY-URL.up.railway.app/api
   ```

### 3. Final Step (1 minute)
1. Copy your Vercel URL (e.g., `https://decanokart.vercel.app`)
2. Update Railway environment variable:
   ```
   CORS_ORIGIN=https://YOUR-VERCEL-URL.vercel.app
   ```

## ✅ Test Your Deployment
- Visit your Vercel URL
- Register a new account
- Browse products
- Test cart functionality

## 🎯 Your URLs
- **Website**: https://your-project.vercel.app
- **API**: https://your-project.up.railway.app/api
- **Health Check**: https://your-project.up.railway.app/api/health

Done! Your e-commerce platform is live! 🎉