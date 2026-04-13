# Split Deployment: Vercel Frontend + Render Backend

This guide covers deploying your React frontend on Vercel and Django backend on Render.

## Architecture

```
┌─────────────────────────────────────────────────────┐
│  Users Visit: st-thomas-tivim-goa.vercel.app       │
└─────────────────┬───────────────────────────────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
        ▼                   ▼
    FRONTEND            BACKEND
    (Vercel)            (Render)
    React App ◄─────► Django API
    http://              http://
    st-thomas-          st-thomas-
    tivim-goa           api.onrender.com
    .vercel.app         /api/
```

## Benefits

✅ **Frontend on Vercel:**
- ⚡ Ultra-fast CDN distribution
- 🌍 Global edge caching
- 💰 Free tier (generous limits)
- 📈 Auto-scales instantly
- Perfect for static React apps

✅ **Backend on Render:**
- 🎯 Built for Python/Django
- 🗄️ PostgreSQL support included
- 💾 Persistent storage
- 🔄 Better for API workloads
- 💰 Free tier available

---

## Step-by-Step Deployment

### Phase 1: Frontend on Vercel (Already Done!)

Your React frontend is already configured to use environment variables. ✅

**Current Vercel Setup:**
```
URL: https://st-thomas-tivim-goa.vercel.app
Repo: GitHub - joji309/St-thomas-church
Branch: main
```

---

### Phase 2: Deploy Backend to Render

#### Step 1: Create Render Account

1. Go to https://render.com
2. Click **"Get Started"** (top right)
3. Sign up with GitHub
4. Authorize Render to access your repositories
5. Complete sign-up

#### Step 2: Create Web Service

1. Go to **Render Dashboard**
2. Click **"New +"** button (top right)
3. Select **"Web Service"**
4. Choose **"Build and deploy from Git repository"**
5. Connect your GitHub repository: `St-thomas-church`
6. Click **"Next"**

#### Step 3: Configure Web Service

Fill in these settings:

```
┌─────────────────────────────────────────┐
│ Name                                    │
│ st-thomas-api                           │
├─────────────────────────────────────────┤
│ Environment                             │
│ Python 3                                │
├─────────────────────────────────────────┤
│ Region                                  │
│ Ohio (us-east) [or closest to you]      │
├─────────────────────────────────────────┤
│ Branch                                  │
│ main                                    │
├─────────────────────────────────────────┤
│ Build Command                           │
│ pip install -r backend/requirements.txt │
├─────────────────────────────────────────┤
│ Start Command                           │
│ gunicorn backend.server.wsgi:application \
│ --bind 0.0.0.0:$PORT                   │
└─────────────────────────────────────────┘
```

#### Step 4: Add Environment Variables

1. Scroll down to **"Environment"** section
2. Click **"Add Environment Variable"**
3. Add these 10 variables:

**Critical Variables:**

| Key | Value |
|-----|-------|
| `DB_ENGINE` | `django.db.backends.postgresql` |
| `DB_NAME` | `neondb` |
| `DB_USER` | `neondb_owner` |
| `DB_PASSWORD` | `npg_Y1gPiLaJnN2x` |
| `DB_HOST` | `ep-proud-fire-a4shaypa-pooler.us-east-1.aws.neon.tech` |
| `DB_PORT` | `5432` |
| `DEBUG` | `False` |
| `SECRET_KEY` | `[your-generated-key]` |
| `ALLOWED_HOSTS` | `st-thomas-api.onrender.com` |
| `CORS_ALLOWED_ORIGINS` | `https://st-thomas-tivim-goa.vercel.app` |

**Optional:**

| Key | Value |
|-----|-------|
| `PYTHONUNBUFFERED` | `1` |
| `DJANGO_SETTINGS_MODULE` | `server.settings` |

#### Step 5: Deploy

1. Scroll to bottom
2. Click **"Create Web Service"**
3. Render will start building your Django app
4. **Wait 5-10 minutes** for deployment

**You'll see:**
```
Building...
Installing dependencies...
Running migrations...
✅ Live (https://st-thomas-api.onrender.com)
```

---

### Phase 3: Connect Frontend to Backend

Your frontend is already set up for this! Update the Vercel environment variables:

#### On Vercel Dashboard:

1. Go to: https://vercel.com/joji309s-projects/st-thomas-tivim-goa
2. Settings → **Environment Variables**
3. Add (or update):

```
VITE_API_BASE_URL = https://st-thomas-api.onrender.com/api
```

**This tells React where the backend is!**

#### Redeploy Frontend:

1. Go to **Deployments** tab
2. Click **"Redeploy"** on latest deployment
3. Select **main** branch
4. Click **"Redeploy"**

---

## Verification Checklist

### Frontend (Vercel)

- [ ] URL: https://st-thomas-tivim-goa.vercel.app
- [ ] Loads without errors
- [ ] CSS/images display correctly
- [ ] No console errors (F12)

### Backend (Render)

- [ ] URL: https://st-thomas-api.onrender.com
- [ ] Visit: `/api/` endpoint shows API root
- [ ] No 500 errors

### Communication

- [ ] Frontend loads data from backend
- [ ] API calls succeed (check Network tab in F12)
- [ ] Data displays on pages
- [ ] Forms work (try Prayer Request or Contact)

---

## Testing the Connection

### Test 1: Check API Directly

Visit in browser:
```
https://st-thomas-api.onrender.com/api/
```

**Should show:** JSON API root interface

### Test 2: Check Frontend Console

1. Visit: https://st-thomas-tivim-goa.vercel.app
2. Open DevTools (F12)
3. Go to **Console** tab
4. Look for any error messages
5. Go to **Network** tab
6. Reload page
7. Check for requests to `st-thomas-api.onrender.com`
   - Should see successful requests (200 status)

### Test 3: Check Data

1. Homepage should show:
   - ✅ Hero carousel
   - ✅ Mass timings
   - ✅ Announcements
   - ✅ Notices

If data shows up, backend communication works! ✅

---

## URLs Reference

**After deployment:**

```
Frontend:        https://st-thomas-tivim-goa.vercel.app
Admin Panel:     https://st-thomas-api.onrender.com/admin
API Root:        https://st-thomas-api.onrender.com/api/
API Docs:        https://st-thomas-api.onrender.com/api/ (browsable)
```

---

## Environment Variables Summary

### Vercel (Frontend)

```
VITE_API_BASE_URL = https://st-thomas-api.onrender.com/api
```

### Render (Backend)

```
DB_ENGINE = django.db.backends.postgresql
DB_NAME = neondb
DB_USER = neondb_owner
DB_PASSWORD = npg_Y1gPiLaJnN2x
DB_HOST = ep-proud-fire-a4shaypa-pooler.us-east-1.aws.neon.tech
DB_PORT = 5432
DEBUG = False
SECRET_KEY = [generated-key]
ALLOWED_HOSTS = st-thomas-api.onrender.com
CORS_ALLOWED_ORIGINS = https://st-thomas-tivim-goa.vercel.app
PYTHONUNBUFFERED = 1
```

---

## Troubleshooting

### Issue: Frontend Can't Connect to Backend

**Checklist:**
- [ ] Backend deployed and is live on Render
- [ ] `VITE_API_BASE_URL` is set correctly in Vercel
- [ ] Frontend redeployed after adding variable
- [ ] Check console for CORS errors (F12)

**Fix CORS Issues:**
- In Render dashboard → Settings
- Update `CORS_ALLOWED_ORIGINS` to match your Vercel domain

### Issue: Backend Won't Start on Render

**Check logs:**
1. Render Dashboard → Your service
2. Go to **Logs** tab
3. Look for error messages
4. Common issues:
   - `ModuleNotFoundError` → Missing Python package
   - `Database connection error` → Wrong DB credentials
   - `Secret key error` → Secret key not set

### Issue: Data Shows But Then Disappears

**Cause:** Render sleeps free tier services after 15 minutes
**Solution:** Upgrade to Starter Plan ($7/month) or accept cold starts

---

## Cost Breakdown

### Free Option (with occasional delays)

| Service | Plan | Cost | Features |
|---------|------|------|----------|
| **Vercel** | Hobby | Free | ✅ Unlimited builds, fast CDN |
| **Render** | Free | Free | ⚠️ Sleeps after 15 min inactive |
| **Neon** | Free | Free | ✅ 5 GB database |
| **Total** | - | **Free** | Good for testing |

### Recommended Option (production-ready)

| Service | Plan | Cost | Features |
|---------|------|------|----------|
| **Vercel** | Hobby | Free | ✅ Unlimited |
| **Render** | Starter | $7/mo | ✅ Always on |
| **Neon** | Free | Free | ✅ 5 GB database |
| **Total** | - | **$7/month** | Reliable for production |

---

## Next Steps

1. ✅ Create Render account (https://render.com)
2. ✅ Deploy Django backend to Render
3. ✅ Add environment variables to Render
4. ✅ Update `VITE_API_BASE_URL` in Vercel
5. ✅ Redeploy frontend on Vercel
6. ✅ Test the connection
7. ✅ Enjoy your live website! 🎉

---

## Commands Reference

### Test Locally (Before Deploying)

```bash
# Terminal 1: Start React frontend
cd frontend
npm install
npm run dev
# Opens at http://localhost:5173

# Terminal 2: Start Django backend  
cd backend
python manage.py migrate
python manage.py runserver
# Runs at http://localhost:8000

# Terminal 3: Test API
curl http://localhost:8000/api/
```

### Useful Render Commands

```bash
# View logs
render logs [service-id]

# Deploy specific branch
# Just push to main and Render auto-deploys
git push origin main
```

---

**Your site will be live at:** 
```
🌐 https://st-thomas-tivim-goa.vercel.app
```

**Ready to deploy?** Follow the steps above! Let me know if you need help! 🚀
