# Resume Analyzer - Production Deployment Guide

## 🚀 Quick Start Deployment

### Prerequisites
- GitHub account
- Vercel account (free)
- Railway account (free)
- Supabase project (free)

---

## 1. Backend Deployment (Railway)

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/resume-analyzer.git
git push -u origin main
```

### Step 2: Deploy to Railway
1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub"
3. Select your repository
4. Railway will auto-detect the Dockerfile
5. Add environment variables:
   ```
   DATABASE_URL=your-supabase-connection-string
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-key
   SUPABASE_ANON_KEY=your-anon-key
   SECRET_KEY=your-generated-secret
   GROQ_API_KEY=your-groq-key
   STORAGE_MODE=supabase
   SENTRY_DSN=your-sentry-dsn (optional)
   ENVIRONMENT=production
   ```
6. Click "Deploy"

### Step 3: Note Your Backend URL
- Railway will provide a URL like: `https://your-app.up.railway.app`

---

## 2. Frontend Deployment (Vercel)

### Step 1: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Framework: Next.js (auto-detected)
5. Root Directory: `frontend`
6. Add environment variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-railway-backend-url
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   NEXT_PUBLIC_GA_ID=your-google-analytics-id (optional)
   ```
7. Click "Deploy"

---

## 3. Database Setup (Supabase)

1. Run migration script in Supabase SQL Editor:
   - Copy `database/schema.sql`
   - Paste in SQL Editor → Run
   - Copy `database/migration_supabase.sql`
   - Paste in SQL Editor → Run

2. Create Storage Buckets:
   - `resumes` (private)
   - `generated-resumes` (private)

3. Enable Realtime:
   - Database → Replication
   - Enable for `analyses` table

---

## 4. CI/CD Setup (GitHub Actions)

### Add GitHub Secrets
Go to Repository → Settings → Secrets → Actions:
```
RAILWAY_TOKEN=your-railway-token
VERCEL_TOKEN=your-vercel-token
VERCEL_ORG_ID=your-org-id
VERCEL_PROJECT_ID=your-project-id
CODECOV_TOKEN=your-codecov-token (optional)
```

---

## 5. Monitoring Setup (Free Tier)

### Sentry (Error Tracking)
1. Go to [sentry.io](https://sentry.io)
2. Create project
3. Copy DSN
4. Add to Railway environment variables

---

## 6. Analytics Setup (Free)

### Google Analytics 4
1. Create GA4 property
2. Get Measurement ID
3. Add to Vercel environment variables

---

## 7. SSL & CDN (CloudFlare) - Optional

1. Go to [cloudflare.com](https://cloudflare.com)
2. Add your domain
3. Update nameservers
4. Enable CDN + SSL (automatic)

---

## 📝 Environment Variables Summary

### Backend (Railway)
```env
DATABASE_URL=postgresql://...
SUPABASE_URL=https://...
SUPABASE_SERVICE_ROLE_KEY=...
SUPABASE_ANON_KEY=...
SECRET_KEY=...
GROQ_API_KEY=...
STORAGE_MODE=supabase
LATEX_MODE=online
SENTRY_DSN=... (optional)
ENVIRONMENT=production
```

### Frontend (Vercel)
```env
NEXT_PUBLIC_API_URL=https://your-backend.up.railway.app
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_GA_ID=... (optional)
```

---

## ✅ Verification Checklist

- [ ] Backend deployed to Railway
- [ ] Frontend deployed to Vercel
- [ ] Database schema applied
- [ ] Storage buckets created
- [ ] Realtime enabled
- [ ] Environment variables configured
- [ ] CI/CD pipeline working
- [ ] SSL certificate active
- [ ] Monitoring configured
- [ ] Analytics tracking

---

## 🎉 You're Live!

Your application is now production-ready and deployed entirely on free tiers!

**Backend:** https://your-app.up.railway.app
**Frontend:** https://your-app.vercel.app

---

## 📊 Free Tier Limits

- **Supabase:** 500MB database, 1GB storage
- **Railway:** $5/month credit (enough for small apps)
- **Vercel:** 100GB bandwidth/month
- **Sentry:** 5,000 errors/month
- **CloudFlare:** Unlimited bandwidth

Total Cost: **$0-5/month**
