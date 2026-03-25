# Vercel Deployment Guide - St. Thomas Church Website

This guide walks you through deploying both the React frontend and Django backend to Vercel.

## ⚠️ Important: Django on Vercel Limitations

Vercel is **optimized for static sites and lightweight serverless functions**. Deploying a full Django application has these limitations:

1. **No local file storage** - Use cloud storage (AWS S3, Cloudinary) for media files
2. **Stateless execution** - Database must be external (PostgreSQL, not SQLite)
3. **Cold starts** - First request may be slow (typical for serverless)
4. **Memory limits** - 3GB per function invocation
5. **Timeout limits** - 60 seconds per request

### Alternative (Recommended for Production)

For better performance, consider:
- **Frontend**: Deploy to Vercel (excellent for static React apps)
- **Backend**: Deploy to Railway, Fly.io, or Heroku (better for Django)

This guide covers deploying both together on Vercel - it works but may not be optimal for production.

## Prerequisites

1. **Vercel Account**: Sign up at https://vercel.com
2. **GitHub Account**: Your code needs to be in a GitHub repository
3. **PostgreSQL Database**: For production (required - SQLite won't work)
4. **Cloud Storage**: AWS S3, Cloudinary, or similar for media files
5. **Environment Variables**: Set up as described below

## Step-by-Step Deployment

### 1. Prepare Your Repository

```bash
# Initialize git if not already done
git init

# Create .gitignore if it doesn't exist
echo "
*.pyc
__pycache__/
*.sqlite3
.env
.env.local
node_modules/
dist/
/media
/backend/staticfiles
" > .gitignore

# Add and commit all files
git add .
git commit -m "Initial commit for Vercel deployment"
```

### 2. Push to GitHub

```bash
# Add remote repository (replace with your repo URL)
git remote add origin https://github.com/yourusername/st-thomas.git
git branch -M main
git push -u origin main
```

### 3. Set Up Database

For production, you should use PostgreSQL instead of SQLite.

**Option A: Using Neon PostgreSQL (Free tier available)**
1. Go to https://neon.tech
2. Sign up and create a new project
3. Copy the database connection string
4. You'll use this string later for environment variables

**Option B: Using AWS RDS**
1. Create an RDS PostgreSQL instance
2. Note your connection details (host, username, password, database name)

**Option C: Using Supabase**
1. Go to https://supabase.com
2. Create a new project
3. Copy the database URL

### 4. Deploy to Vercel

**Using Vercel CLI (Recommended for first time):**

```bash
# Install Vercel CLI globally
npm install -g vercel

# In the project root directory, run:
vercel
```

Follow the prompts:
- Link to your GitHub repository
- Select your organization
- Choose the root of the project

**Or Deploy via Vercel Web UI:**

1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Select your GitHub repository
4. Configure build settings:
   - Framework Preset: Other
   - Build Command: `cd frontend && npm install && npm run build && cd ../backend && pip install -r requirements.txt`
   - Output Directory: `frontend/dist`
   - Install Command: `pip install -r backend/requirements.txt && cd frontend && npm install`

### 5. Set Environment Variables

In your Vercel project settings, go to **Settings → Environment Variables** and add:

```
SECRET_KEY = your-very-secure-secret-key-here
DEBUG = False
ALLOWED_HOSTS = your-project.vercel.app,your-custom-domain.com
CORS_ALLOWED_ORIGINS = https://your-project.vercel.app,https://your-custom-domain.com

# Database (PostgreSQL)
DB_ENGINE = django.db.backends.postgresql
DB_NAME = your_database_name
DB_USER = your_database_user
DB_PASSWORD = your_database_password
DB_HOST = your-database-host.com
DB_PORT = 5432
```

### 6. Run Migrations

After the first deployment, you need to create database tables:

```bash
# Connect to your Vercel deployment
# Option 1: Via Vercel CLI
vercel env pull .env.production.local

# Then run migrations (you'll need to create a management command or script)
# This is typically done via a one-time job or local script
```

**Important**: You might want to create a management script to run migrations. Add this to your project:

**Create `backend/manage_migrations.py`:**

```python
#!/usr/bin/env python
import os
import django
import sys

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'server.settings')
django.setup()

from django.core.management import execute_from_command_line

if __name__ == "__main__":
    execute_from_command_line(sys.argv)
```

Run it after deployment:
```bash
vercel env pull .env.production.local
python backend/manage.py migrate
```

## Troubleshooting

### 1. Build Fails
- Check Vercel logs: Go to your project → Deployments → Click on failed deployment
- Ensure all Python packages are in `requirements.txt`
- Check that Node.js packages are listed in `frontend/package.json`

### 2. API Not Working
- Verify CORS_ALLOWED_ORIGINS includes your Vercel domain
- Check that DATABASE credentials are correct
- Review Django logs in Vercel Functions logs

### 3. Static Files Not Loading
- Ensure `frontend/dist` exists after build
- Check that STATICFILES_DIRS is correctly configured
- WhiteNoise middleware should be serving them

### 4. "Module not found" Errors
- Ensure all Python packages are in `requirements.txt`
- Any new Django apps must be added to INSTALLED_APPS in settings.py

## Important Notes

1. **Database Persistence**: SQLite won't work on Vercel (ephemeral filesystem). Use PostgreSQL.
2. **Media Files**: Store in a cloud service (AWS S3, Cloudinary) or embed in the database.
3. **Static Files**: WhiteNoise handles this automatically.
4. **First Deployment**: May take 5-10 minutes for first build.
5. **Cost**: Vercel offers free tier with generous limits for small projects.

## Environment Variables Required

Copy and customize `backend/.env.example` and `frontend/.env.example`:

```bash
cd backend
cp .env.example .env
# Edit .env with your values

cd ../frontend
cp .env.example .env.local
# Edit .env.local if needed
```

## Local Development After Vercel Setup

```bash
# Frontend
cd frontend
npm install
npm run dev

# Backend (in another terminal)
cd backend
python manage.py runserver
```

## Monitoring and Maintenance

1. **View Logs**: `vercel logs <url>`
2. **View Analytics**: Dashboard → Analytics
3. **Redeploy**: Push to GitHub or use `vercel --prod` from CLI
4. **Custom Domain**: Settings → Domains

## Need Help?

- Vercel Docs: https://vercel.com/docs
- Django Deployment: https://docs.djangoproject.com/en/stable/howto/deployment/
- PostgreSQL: https://www.postgresql.org/docs/
