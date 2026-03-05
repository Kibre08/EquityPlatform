# Deployment Guide for Equity Platform

To make your platform globally accessible, you can deploy it to cloud services. I recommend **Render** for the backend and **Vercel** for the frontend.

## 1. Database (MongoDB Atlas)
Since your app already uses MongoDB, ensure your Atlas cluster allows connections from anywhere:
1. Go to MongoDB Atlas -> **Network Access**.
2. Add IP Address -> **Allow Access from Anywhere** (0.0.0.0/0).
   *Note: For higher security later, you can restrict this to Render's IPs, but 0.0.0.0/0 is easiest for now.*
3. Get either your existing Connection String or create a new database user.

## 2. Backend (Render)
1. Push your code to GitHub.
2. Sign up at [render.com](https://render.com).
3. Create a **New Web Service**.
4. Connect your GitHub repo `EquityPlatform`.
5. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment Variables**:
     - `MONGO_URI`: (Your Atlas connection string)
     - `JWT_SECRET`: (Your secret key)
     - `PORT`: `10000` (Render handles the port, but value doesn't matter much)
6. Deploy. Copy the **Service URL** (e.g., `https://equity-api.onrender.com`).

## 3. Frontend (Vercel)
1. Sign up at [vercel.com](https://vercel.com).
2. **Add New Project** -> Import from GitHub.
3. Configure:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite
   - **Build Command**: `vite build`
   - **Environment Variables**:
     - `VITE_API_URL`: (Paste your Backend Service URL here, e.g., `https://equity-api.onrender.com`)
       *Do not add a trailing slash.*
4. Deploy.

Your app will be live at the Vercel URL!
