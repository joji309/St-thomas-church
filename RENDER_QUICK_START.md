# RENDER DEPLOYMENT - QUICK START GUIDE

> **St. Thomas Church Website** - Deploy to Render in 15 minutes

---

## 🚀 Quick Summary

Your application is **fully configured** for Render deployment. Everything needed is in place.

**What you're deploying:**
- React front-end (Vite + Tailwind CSS)
- Django REST API backend
- PostgreSQL database
- Static files served by Django/WhiteNoise

---

## 📋 Pre-Flight Checklist (2 minutes)

```bash
# 1. Verify everything is committed
git status                    # Should be clean
git log -1                    # Check latest commit

# 2. Test local build (optional but recommended)
python verify_render_build.py

# 3. Push to main branch
git push origin main
```

---

## 🔑 Step 1: Generate Config (2 minutes)

Generate your Django SECRET_KEY:

```bash
python generate_deployment_config.py
```

This will create:
- `SECRET_KEY` - Copy this value
- `.env` file (local development only)
- Configuration template

---

## 🗄️ Step 2: Setup Database (3 minutes)

Choose one option:

### Option A: Neon (Recommended - Free tier)

1. Go to https://neon.tech
2. Sign up with GitHub
3. Create project → Copy connection credentials
4. Note: `HOST`, `USER`, `PASSWORD`, `PORT`

### Option B: Render PostgreSQL

1. In Render dashboard: New → PostgreSQL
2. Name: `st-thomas-church-db`
3. Note the connection string

---

## 🌐 Step 3: Create Web Service on Render (5 minutes)

### Access Render

1. Go to https://dashboard.render.com
2. Log in / Sign up with GitHub
3. Click **"New +"** → **"Web Service"**
4. Select your GitHub repository: `joji309/St-thomas-church`
5. Click **"Connect"**

### Configure Service

Fill in these fields:

| Setting | Value |
|---------|-------|
| **Name** | `st-thomas-church` |
| **Environment** | Python 3 |
| **Region** | Ohio (us-east) or nearest |
| **Branch** | main |
| **Build Command** | Already configured in render.yaml |
| **Start Command** | Already configured in Procfile |
| **Plan** | Free tier (or Starter) |

### Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"** for each:

#### Core Settings
```
DEBUG=False
SECRET_KEY=<paste your generated key>
ALLOWED_HOSTS=st-thomas-church-XXXXX.onrender.com
```

#### Database
```
DB_ENGINE=django.db.backends.postgresql
DB_NAME=neondb
DB_USER=<your db username>
DB_PASSWORD=<your db password>
DB_HOST=<your db host>
DB_PORT=5432
```

#### Security
```
CORS_ALLOWED_ORIGINS=https://st-thomas-church-XXXXX.onrender.com
```

### Deploy

Click **"Create Web Service"**

Render will now build and deploy your application (5-10 minutes)

---

## ✅ Step 4: Verify Deployment (2 minutes)

### Watch Logs

1. In Render dashboard, click your service
2. Go to **"Logs"** tab
3. Look for:
   ```
   ✓ Building...
   ✓ Installing Python dependencies
   ✓ npm install && npm run build
   ✓ collectstatic
   ✓ Migrations completed
   ✓ Gunicorn started
   ✓ Service is live
   ```

### Test Website

Once deployed, visit:

- Homepage: https://st-thomas-church-XXXXX.onrender.com/
- Blog: https://st-thomas-church-XXXXX.onrender.com/blog
- Gallery: https://st-thomas-church-XXXXX.onrender.com/gallery
- Admin: https://st-thomas-church-XXXXX.onrender.com/admin
- API: https://st-thomas-church-XXXXX.onrender.com/api/

---

## 🛠️ Common Issues

| Issue | Solution |
|-------|----------|
| **BUILD FAILED: "Could not find module"** | Check requirements.txt has all packages (django, psycopg2-binary, gunicorn, whitenoise) |
| **404 errors** | Update `ALLOWED_HOSTS` environment variable with your Render URL |
| **CSS/JS not loading** | Clear browser cache and hard-refresh (Ctrl+Shift+R) |
| **Database connection error** | Verify database credentials in environment variables |
| **Admin login fails** | Migrations may have failed - check logs |
| **CSS looks broken** | Rebuild: in Render, click "Services" → "Manual Deploy" |

See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for more help.

---

## 📚 Detailed Documentation

| Document | Purpose |
|----------|---------|
| [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md) | Comprehensive deployment guide |
| [RENDER_DEPLOYMENT_STEPS.md](RENDER_DEPLOYMENT_STEPS.md) | Step-by-step with all details |
| [RENDER_DEPLOYMENT_CHECKLIST.md](RENDER_DEPLOYMENT_CHECKLIST.md) | Complete checklist |
| [TROUBLESHOOTING.md](TROUBLESHOOTING.md) | Issue resolution |

---

## 🔄 After Deployment

### Create Admin User

Option 1: Via Render Shell
```bash
# In Render dashboard, click your service → Shell
cd backend
python manage.py createsuperuser
```

Option 2: Manually (first time)
```
Use script: python setup_admin.py
```

### Add Content

1. Login: https://st-thomas-church-XXXXX.onrender.com/admin
2. Add blog posts, gallery images, etc.

### Setup Auto-Deploy

- Default: Already enabled
- Every push to `main` triggers new deployment
- Deployments take ~5-10 minutes

---

## 📊 Monitoring

### View Logs
```
Render Dashboard → Your Service → Logs
```

### Check Metrics
```
Render Dashboard → Your Service → Metrics
```

### Restart Service
```
Render Dashboard → Your Service → Restart
```

---

## 🆘 Getting Help

If something goes wrong:

1. Check **Logs** in Render dashboard (most detailed)
2. Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
3. Review environment variables are correct
4. Verify database is running and accessible
5. Contact support: [Render Docs](https://docs.render.com)

---

## 📝 Key Files

| File | Purpose |
|------|---------|
| `render.yaml` | Render configuration |
| `Procfile` | Build & start commands |
| `backend/requirements.txt` | Python dependencies |
| `frontend/package.json` | Node dependencies |
| `backend/server/settings.py` | Django settings |
| `.env.example` | Environment variables template |

---

## ✨ What's Configured

✅ **Frontend**
- React + Vite + Tailwind CSS
- Auto-built on deploy
- Served by Django/WhiteNoise

✅ **Backend**
- Django + Django REST Framework
- Gunicorn WSGI server
- PostgreSQL ready

✅ **Database**
- Automatic migrations on deploy
- PostgreSQL with Neon support
- Backups included

✅ **Security**
- HTTPS/SSL enabled
- CORS configured
- Security headers enabled
- HSTS enabled

✅ **Performance**
- Static file compression
- Minified frontend assets
- Database connection pooling

---

## 🎯 Next Steps

1. ✅ Complete the Quick Summary section above
2. ✅ Generate SECRET_KEY: `python generate_deployment_config.py`
3. ✅ Setup database (Neon recommended)
4. ✅ Deploy to Render (5-minute process)
5. ✅ Verify site is live
6. ✅ Create admin user and add content

---

**You're ready to deploy!** 🚀

Questions? Check the detailed documentation files or Render's official docs.

---

*Last Updated: 2024*  
*St. Thomas Church Website - Render Deployment*
