# RENDER DEPLOYMENT CHECKLIST

## Pre-Deployment (Local Machine)

### Code Verification
- [ ] Latest code committed to `main` branch
  ```bash
  git status    # Should be clean
  git push origin main
  ```

- [ ] Database migrations created (if any model changes)
  ```bash
  cd backend
  python manage.py makemigrations
  python manage.py migrate
  cd ..
  ```

- [ ] Frontend builds successfully
  ```bash
  cd frontend
  npm install
  npm run build
  ls dist/     # Verify dist folder exists
  ```

- [ ] Backend dependencies installed
  ```bash
  cd backend
  pip install -r requirements.txt
  ```

- [ ] Environment variables documented
  ```bash
  cp .env .env.backup
  # Review .env.example for all needed variables
  ```

### Configuration Verification
- [ ] `render.yaml` exists and is valid
- [ ] `Procfile` has correct commands
- [ ] `frontend/package.json` has build script
- [ ] `backend/requirements.txt` complete with:
  - [ ] Django
  - [ ] djangorestframework
  - [ ] psycopg2-binary (PostgreSQL)
  - [ ] gunicorn
  - [ ] whitenoise
  - [ ] django-cors-headers
  - [ ] python-decouple

- [ ] `.gitignore` excludes:
  - [ ] `.env` files
  - [ ] `venv/`, `node_modules/`
  - [ ] `*.sqlite3`, `db.sqlite3`
  - [ ] `/staticfiles/`
  - [ ] `/dist/` (frontend)

### GitHub Verification
- [ ] Repository is public (or Render has access)
- [ ] Main branch is up to date
- [ ] No uncommitted changes
  ```bash
  git status
  ```

---

## Render Dashboard Setup

### Account & Authorization
- [ ] Render account created
- [ ] Email verified
- [ ] GitHub connected to Render

### Database Setup (if using PostgreSQL)
- [ ] Database created (Neon or Render PostgreSQL)
- [ ] Database credentials noted:
  - [ ] DB_HOST
  - [ ] DB_USER
  - [ ] DB_PASSWORD
  - [ ] DB_NAME
  - [ ] DB_PORT

### Web Service Creation
- [ ] Repository connected
- [ ] Service name: `st-thomas-church`
- [ ] Runtime: Python 3
- [ ] Region: Ohio (us-east) or preferred region
- [ ] Branch: main
- [ ] Build command set correctly
- [ ] Start command set correctly

### Environment Variables Set
- [ ] DEBUG = False
- [ ] SECRET_KEY = (generated)
- [ ] ALLOWED_HOSTS = (your-render-url.onrender.com)
- [ ] DB_ENGINE = django.db.backends.postgresql
- [ ] DB_NAME = (database name)
- [ ] DB_USER = (database user)
- [ ] DB_PASSWORD = (database password)
- [ ] DB_HOST = (database host)
- [ ] DB_PORT = 5432
- [ ] CORS_ALLOWED_ORIGINS = (https://your-render-url.onrender.com)

---

## Deployment Execution

### Deploy
- [ ] Click "Create Web Service" on Render
- [ ] Watch deployment in Logs
- [ ] Deployment completes without errors

### Verify Build Steps in Logs
- [ ] ✓ Python dependencies installed
- [ ] ✓ npm packages installed
- [ ] ✓ Frontend built to dist/
- [ ] ✓ Static files collected
- [ ] ✓ Migrations ran successfully
- [ ] ✓ Gunicorn server started
- [ ] ✓ Service is live

---

## Post-Deployment Verification

### Test Website
- [ ] Homepage loads
  ```
  https://your-render-url.onrender.com/
  ```

- [ ] Blog page loads
  ```
  https://your-render-url.onrender.com/blog
  ```

- [ ] Gallery page loads
  ```
  https://your-render-url.onrender.com/gallery
  ```

- [ ] Contact page works
  ```
  https://your-render-url.onrender.com/contact
  ```

- [ ] Admin panel accessible
  ```
  https://your-render-url.onrender.com/admin
  ```

- [ ] API endpoints respond
  ```
  https://your-render-url.onrender.com/api/
  ```

- [ ] Static files load (CSS, JS, images)
- [ ] Media files load correctly
- [ ] No console errors in browser DevTools

### Test Admin Functions
- [ ] Login to admin panel
- [ ] Create test blog post
- [ ] Upload image to gallery
- [ ] Check database integrity

### Monitor Service
- [ ] Check Render Logs for errors
- [ ] Check build time (should be ~5-10 min)
- [ ] Verify HTTPS is enabled
- [ ] Check metrics dashboard

---

## Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| Build error: "vite not found" | Ensure npm install runs before npm run build in Procfile |
| 404 errors | Check ALLOWED_HOSTS includes render URL |
| CSS/JS not loading | Verify collectstatic ran successfully |
| Database connection failed | Verify DB credentials in environment variables |
| Admin login fails | Check if migrations ran correctly |
| Slow page loads | May be free tier container - consider upgrading plan |

---

## Maintenance Notes

- [ ] Set up automated backups (if using PostgreSQL)
- [ ] Enable auto-deploy for future pushes
- [ ] Monitor service metrics and logs regularly
- [ ] Plan for scale as traffic increases
- [ ] Keep dependencies updated

---

## Documentation

- [ ] [Render Deployment Guide](RENDER_DEPLOYMENT.md)
- [ ] [Detailed Steps](RENDER_DEPLOYMENT_STEPS.md)
- [ ] [Troubleshooting Guide](TROUBLESHOOTING.md)

---

**Status**: Ready for Deployment ✓

**Rendered URL**: https://st-thomas-church-xxxxx.onrender.com

**Next Step**: Review this checklist, then click "Create Web Service" on Render.com
