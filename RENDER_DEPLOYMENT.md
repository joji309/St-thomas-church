# Render Deployment Guide

Your St. Thomas Church website is configured for deployment on **Render**.

## Architecture

```
Render Service (Single Container)
├── Frontend: React (built to static files)
├── Backend: Django + Gunicorn (serves both)
├── API: REST endpoints at /api/
├── Admin: Django admin at /admin/
└── Database: PostgreSQL (Neon)
```

## Deployment Steps

### 1. On Render.com

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Connect GitHub repository: `joji309/St-thomas-church`

### 2. Configure Service

Fill in these settings:

**Basics:**
- Name: `st-thomas-church`
- Environment: `Python 3`
- Region: `Ohio (us-east)` or nearest to you
- Branch: `main`

**Build & Deploy:**
- Build Command: (auto-detected from Procfile)
- Start Command: (auto-detected from Procfile)

**Plan:**
- Select **Free** (or **Pro** if you want always-on)

### 3. Environment Variables

Click **"Environment"** and add these:

```
KEY                    VALUE
DEBUG                  False
SECRET_KEY             (generate: python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())")
DB_ENGINE              django.db.backends.postgresql
DB_NAME                neondb
DB_USER                neondb_owner
DB_PASSWORD            npg_Y1gPiLaJnN2x
DB_HOST                ep-proud-fire-a4shaypa-pooler.us-east-1.aws.neon.tech
DB_PORT                5432
ALLOWED_HOSTS          (your-render-url.onrender.com - fill after deploy)
CORS_ALLOWED_ORIGINS   https://(your-render-url.onrender.com)
```

### 4. Deploy

Click **"Create Web Service"** → Deployment starts automatically

**First deploy takes:** 5-10 minutes

---

## Monitoring Deployment

1. Watch the **Logs** tab in real-time
2. You should see:
   ```
   - Building...
   - Installing Python dependencies
   - npm install
   - npm run build
   - Running migrations
   - Starting gunicorn
   ✓ Service is live
   ```

---

## After Deployment

Your site will be live at:
```
https://st-thomas-church-xxxxx.onrender.com
```

All features accessible from one URL:

```
🏠 Homepage:       https://st-thomas-church-xxxxx.onrender.com/
📖 Blog:           https://st-thomas-church-xxxxx.onrender.com/blog
📷 Gallery:        https://st-thomas-church-xxxxx.onrender.com/gallery
💬 Prayer Request: https://st-thomas-church-xxxxx.onrender.com/prayer
📝 Contact:        https://st-thomas-church-xxxxx.onrender.com/contact
🔧 Admin Panel:    https://st-thomas-church-xxxxx.onrender.com/admin
📡 API:            https://st-thomas-church-xxxxx.onrender.com/api/
```

---

## Files in This Deployment

**Key files for Render:**

- `Procfile` - Build & start commands
- `render.yaml` - Service configuration
- `backend/requirements.txt` - Python dependencies
- `frontend/package.json` - Node dependencies
- `backend/server/settings.py` - Django config

---

## Troubleshooting

### Build Failed: "vite: command not found"

```
✓ FIXED - Node packages now install before build
```

### Build Failed: "ModuleNotFoundError"

```
Check backend/requirements.txt has all packages:
- django
- djangorestframework
- psycopg2-binary
- gunicorn
- whitenoise
```

### Site Shows 404 or Blank Page

```
Check:
1. Render Logs for errors
2. Environment variables are set
3. Database connection successful
```

### Database Migration Failed

```
Check Render Logs:
- Neon PostgreSQL is running
- Credentials are correct
- Connection string is valid
```

---

## Production Tips (Free → Pro)

**Render Free Plan:**
- ✅ Spins down after 15 minutes of inactivity
- ✅ Cold starts (~30 seconds to wake)
- ✅ Perfect for testing/hobby projects

**Upgrade to Pro ($7/month):**
- ✅ Always-on (no spin-down)
- ✅ Better performance
- ✅ 24/7 uptime

---

## Custom Domain (Optional)

1. Render Dashboard → **Settings** → **Custom Domain**
2. Add your domain: `stthomas.yourdomain.com`
3. Follow DNS setup instructions
4. Update `ALLOWED_HOSTS` and `CORS_ALLOWED_ORIGINS` in environment variables

---

## Deployment Summary

```
✓ Frontend built to static files
✓ Django serves frontend + API
✓ Single container (simple)
✓ PostgreSQL on Neon
✓ Auto-scales on Render
✓ Free tier + optional Pro upgrade
```

**Status:** Ready to deploy! 🚀
