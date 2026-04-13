#!/bin/bash

# ========================================================================
# RENDER DEPLOYMENT GUIDE - St. Thomas Church Website
# ========================================================================
# This is a comprehensive deployment guide with all verification steps
# ========================================================================

Step 0: PRE-DEPLOYMENT VERIFICATION
===================================

Before starting deployment, verify:

✓ Local Build Test
  Frontend:
    cd frontend
    npm install
    npm run build
    
  Backend:
    cd backend
    pip install -r requirements.txt
    python manage.py collectstatic --noinput
    
  Verify dist folder was created: ls frontend/dist/

✓ Git State
  git status  # Should be clean
  git log -1  # Latest commit info
  
✓ All changes committed
  git add -A
  git commit -m "Ready for Render deployment"
  git push origin main


Step 1: PREPARE RENDER.COM ACCOUNT
==================================

1. Create account at https://render.com (or login)
2. Verify email address
3. Connect GitHub account to Render:
   - Go to Settings → GitHub
   - Click "Connect GitHub"
   - Authorize access to your repos


Step 2: SETUP DATABASE (PostgreSQL with Neon)
==============================================

Option A: Use Neon (Recommended - Free tier available)
------------------------------------------------------
1. Go to https://neon.tech
2. Sign up with GitHub
3. Create a new project
4. Note these credentials:
   - Connection string (appears as URL)
   - Database name: neondb
   - Username: neondb_owner
   - Password: (saved during setup)
   - Host: (from connection string)
   - Port: 5432

Example connection string:
  postgresql://neondb_owner:PASSWORD@HOSTNAME-pooler.us-east-1.aws.neon.tech/neondb

Extract values:
  DB_HOST = (HOSTNAME)-pooler.us-east-1.aws.neon.tech
  DB_USER = neondb_owner
  DB_PASSWORD = PASSWORD
  DB_NAME = neondb
  DB_PORT = 5432

Option B: Use Render PostgreSQL
-------------------------------
1. In Render Dashboard, click "New +" → "PostgreSQL"
2. Configure:
   - Name: st-thomas-church-db
   - Database: neondb
   - User: neondb_owner
   - Region: same as Web Service
   - Plan: Free
3. Note the Internal Database URL


Step 3: CREATE WEB SERVICE ON RENDER
===================================

1. Go to https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Select Repository
   - Provider: Git
   - Repository: joji309/St-thomas-church
   - Branch: main


Step 4: CONFIGURE WEB SERVICE
=============================

Fill in these settings:

Basic Settings:
  Name: st-thomas-church
  Root Directory: (leave empty)
  Environment: Python 3
  Region: Ohio (us-east) [or nearest to you]
  Branch: main
  Auto-deploy: Yes

Plan: Free (or Pro for always-on)

Build Command:
  pip install -r backend/requirements.txt &&
  cd frontend &&
  npm install &&
  npm run build &&
  cd ../backend &&
  python manage.py collectstatic --noinput

Start Command:
  cd backend &&
  gunicorn server.wsgi:application
  --bind 0.0.0.0:$PORT
  --workers 2
  --timeout 60


Step 5: ADD ENVIRONMENT VARIABLES
==================================

Click "Environment" and add each variable:

CRITICAL VARIABLES:
  KEY                    VALUE
  DEBUG                  False
  SECRET_KEY             (generate below)
  ALLOWED_HOSTS          st-thomas-church-xxxxx.onrender.com

DATABASE VARIABLES:
  DB_ENGINE              django.db.backends.postgresql
  DB_NAME                neondb
  DB_USER                neondb_owner
  DB_PASSWORD            (from Neon/PostgreSQL)
  DB_HOST                (your database host)
  DB_PORT                5432

CORS VARIABLES:
  CORS_ALLOWED_ORIGINS   https://st-thomas-church-xxxxx.onrender.com

GENERATE SECRET_KEY:
  Locally run:
    python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
  Then paste the output into SECRET_KEY variable


Step 6: CONNECT DATABASE (if using Neon)
========================================

Optional: Connect PostgreSQL service to Web Service
  In Render Dashboard:
    1. Go to Web Service
    2. Settings → Environment
    3. Add DATABASE_URL from PostgreSQL service (if using Render's DB)
    
Note: We're using environment variables instead, so this is optional


Step 7: DEPLOY
=============

Click "Create Web Service"

Render will now:
1. Clone your repository
2. Install Python dependencies
3. Build frontend React app
4. Collect static files
5. Run database migrations (from Procfile release command)
6. Start Gunicorn server

Monitor the deployment:
  - Watch the "Build & Deploy" section
  - Check logs in real-time
  - Should complete in 5-10 minutes


Step 8: VERIFY DEPLOYMENT
=========================

Check the Logs:
  1. Go to your service on Render
  2. Click "Logs"
  3. You should see:
     ✓ Building...
     ✓ Running Python setup...
     ✓ npm install
     ✓ npm run build
     ✓ collectstatic
     ✓ Running migrations
     ✓ Gunicorn server started

Visit Your Site:
  Your URL will be: https://st-thomas-church-xxxxx.onrender.com
  
Test these URLs:
  ✓ https://st-thomas-church-xxxxx.onrender.com/
  ✓ https://st-thomas-church-xxxxx.onrender.com/blog
  ✓ https://st-thomas-church-xxxxx.onrender.com/gallery
  ✓ https://st-thomas-church-xxxxx.onrender.com/admin
  ✓ https://st-thomas-church-xxxxx.onrender.com/api/


Step 9: POST-DEPLOYMENT SETUP
=============================

1. Create Admin User:
   - Go to /admin
   - Use default admin credentials (if set via setup script)
   - Or use Render shell to create new admin:
     
     render-cli run --service=st-thomas-church \
       "cd backend && python manage.py createsuperuser"

2. Configure Site Settings:
   - Login to admin panel at /admin
   - Update Site Settings
   - Add blog posts, gallery images, etc.


Step 10: MONITORING & MAINTENANCE
==================================

View Logs:
  Dashboard → Service → Logs

Check Service Health:
  Dashboard → Service → Metrics

Update Code:
  1. Make changes locally
  2. Commit and push: git push origin main
  3. Render auto-deploys (if auto-deploy is enabled)

Scale Workers:
  If needed, increase workers in Start Command:
    --workers 4  # or higher

Auto-start on Crash:
  Render automatically restarts failed services


===== TROUBLESHOOTING =====

Build Failed: "vite: command not found"
  ✓ Fixed in render.yaml - npm install runs before npm run build

Build Failed: "ModuleNotFoundError"
  Check: backend/requirements.txt has:
    - django
    - djangorestframework
    - psycopg2-binary
    - gunicorn
    - whitenoise

Build Failed: "Could not connect to database"
  Check:
    1. Database credentials in environment variables
    2. Database is running and accessible
    3. Host, port, username, password are correct

Site Shows 404
  Check:
    1. Logs for errors
    2. ALLOWED_HOSTS includes your render URL
    3. Static files directory exists

Migrations Failed
  View logs and check:
    1. Database connection
    2. Migrations directory exists
    3. No conflicting migration names


===== FINAL NOTES =====

Your deployment is now complete! Here's what's running:

Frontend:
  - React app built with Vite
  - Served by Django's WhiteNoise middleware
  - Located at: /frontend/dist

Backend:
  - Django REST Framework
  - Gunicorn WSGI server
  - PostgreSQL database
  - Admin interface at /admin

Database:
  - PostgreSQL (Neon recommended)
  - All migrations auto-run on deploy
  - Backups via Neon/Render

Security:
  - SSL/TLS enabled (HTTPS)
  - CORS configured for your domain
  - Django security headers enabled
  - HSTS enabled for 1 year

For more help, visit: https://docs.render.com
