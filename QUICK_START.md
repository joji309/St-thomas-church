# Quick Start: Deploy to Vercel in 10 Minutes

Get your St. Thomas Church website live on Vercel quickly!

## Step 1: Create Accounts (2 min)
1. Sign up on https://vercel.com (free)
2. Sign up on https://neon.tech (free PostgreSQL)
3. Connect your GitHub account to Vercel

## Step 2: Create Database (2 min)
1. On Neon, create a new project
2. Copy the PostgreSQL connection string (looks like: `postgresql://user:pass@host/db`)

## Step 3: Generate Secret Key (1 min)
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```
Save the output - you'll need it!

## Step 4: Push to GitHub (2 min)
```bash
git init
git add .
git commit -m "Ready to deploy to Vercel"
git remote add origin https://github.com/YOUR_USERNAME/st-thomas.git
git push -u origin main
```

## Step 5: Deploy (2 min)
1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Select your st-thomas repository
4. Click Deploy

## Step 6: Add Environment Variables (1 min)
After deployment starts, go to **Settings → Environment Variables** and add:

```
SECRET_KEY = [paste your generated key from Step 3]
DEBUG = False
ALLOWED_HOSTS = your-project.vercel.app
CORS_ALLOWED_ORIGINS = https://your-project.vercel.app
DB_ENGINE = django.db.backends.postgresql
DB_NAME = [from your Neon connection string]
DB_USER = [from your Neon connection string]
DB_PASSWORD = [from your Neon connection string]
DB_HOST = [from your Neon connection string]
DB_PORT = 5432
```

## Step 7: Run Migrations (1 min after deployment)
Wait for the deployment to finish, then run in your terminal:
```bash
vercel env pull .env.production.local
cd backend
python manage.py migrate
python manage.py createsuperuser  # Create admin user
```

## Done! 🎉
Your website is now live at: https://your-project.vercel.app

Access admin at: https://your-project.vercel.app/admin/

---

## Need Help?

**Problem**: Build fails
- Check Vercel logs (Deployments tab)
- Ensure all dependencies are in `requirements.txt`

**Problem**: Database connection error
- Verify your Neon connection string is correct
- Check DB_HOST, DB_NAME, DB_USER, DB_PASSWORD

**Problem**: CORS errors
- Update CORS_ALLOWED_ORIGINS to include your Vercel domain

**Problem**: Admin won't load
- Ensure you ran migrations
- Verify you created a superuser

See [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md) for detailed instructions.
