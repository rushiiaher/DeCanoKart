# De Canokart - Deployment Guide

## Quick Deployment Steps

### 1. Backend Deployment (Railway)
1. Push your code to GitHub
2. Go to [railway.app](https://railway.app) and sign up
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Railway will auto-detect Node.js and deploy

**Environment Variables to set in Railway:**
```
MONGO_URL=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/database-name
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=production
CORS_ORIGIN=https://your-vercel-app.vercel.app
```

### 2. Frontend Deployment (Vercel)
1. Go to [vercel.com](https://vercel.com) and sign up
2. Click "New Project" → Import from GitHub
3. Select your repository
4. Set Root Directory to `frontend`
5. Vercel will auto-detect React and deploy

**Environment Variables to set in Vercel:**
```
REACT_APP_API_URL=https://your-railway-app.railway.app
REACT_APP_ENV=production
```

### 3. MongoDB Atlas Setup
- Your existing MongoDB Atlas database will work as-is
- Just update the MONGO_URL in Railway with your Atlas connection string
- Format: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/database-name`

## Important Notes

### Data Preservation
✅ **Your MongoDB data will remain exactly the same**
✅ **No need to re-submit any data**
✅ **All existing users, products, orders will be preserved**

### URLs to Update
After deployment, update these in your environment variables:
- Replace `REACT_APP_API_URL` in Vercel with your Railway backend URL
- Replace `CORS_ORIGIN` in Railway with your Vercel frontend URL

### Testing
1. Test your Railway backend: `https://your-app.railway.app/api/products`
2. Test your Vercel frontend: `https://your-app.vercel.app`

## Troubleshooting
- If CORS errors occur, check that CORS_ORIGIN matches your Vercel URL
- If API calls fail, verify REACT_APP_API_URL is correct
- Check Railway logs for backend errors
- Check Vercel function logs for frontend errors

## Free Tier Limits
- **Railway**: 500 hours/month, $5 credit
- **Vercel**: 100GB bandwidth, unlimited deployments
- **MongoDB Atlas**: 512MB storage (free tier)

Both platforms offer generous free tiers perfect for your project!