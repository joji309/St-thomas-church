# Pre-Deployment Checklist

Use this checklist before deploying to Vercel.

## Code Changes ✅
- [x] Created `vercel.json` for Vercel configuration
- [x] Created `api/index.py` as serverless function entry point
- [x] Updated `backend/server/settings.py` for production environment
- [x] Updated `frontend/src/api.js` to support environment-based API URLs
- [x] Created `requirements.txt` with Python dependencies
- [x] Created `.env.example` files for both frontend and backend
- [x] Added root `package.json` with useful scripts
- [x] Added `setup_admin.py` for database initialization

## Before You Deploy

### 1. Repository Setup
- [ ] Initialize Git: `git init`
- [ ] Create `.gitignore` file
- [ ] Commit all changes: `git add . && git commit -m "Initial commit"`
- [ ] Push to GitHub
- [ ] Verify repository is public (or grant Vercel access if private)

### 2. Environment Setup
- [ ] Create Neon PostgreSQL account (https://neon.tech)
  - Or use AWS RDS, Supabase, or other PostgreSQL provider
- [ ] Create PostgreSQL database and get connection string
- [ ] (Optional) Set up AWS S3 or Cloudinary for media files
- [ ] Generate a secure Django SECRET_KEY
  ```python
  from django.core.management.utils import get_random_secret_key
  print(get_random_secret_key())
  ```
- [ ] Note your Vercel project domain (will be your-project.vercel.app)

### 3. Environment Variables
Prepare these before deployment:
```
SECRET_KEY = <generated-secure-key>
DEBUG = False
ALLOWED_HOSTS = your-project.vercel.app,your-custom-domain.com
CORS_ALLOWED_ORIGINS = https://your-project.vercel.app,https://your-custom-domain.com

DB_ENGINE = django.db.backends.postgresql
DB_NAME = <database-name>
DB_USER = <database-user>
DB_PASSWORD = <database-password>
DB_HOST = <database-host>
DB_PORT = 5432
```

### 4. Local Testing
- [ ] Install dependencies locally:
  ```bash
  npm install
  cd backend && pip install -r requirements.txt
  ```
- [ ] Run migrations locally:
  ```bash
  cd backend
  python manage.py migrate
  ```
- [ ] Create admin user locally:
  ```bash
  python manage.py createsuperuser
  ```
- [ ] Test frontend build:
  ```bash
  cd frontend && npm run build
  ```
- [ ] Start dev server and test locally:
  ```bash
  # In one terminal
  cd frontend && npm run dev
  
  # In another terminal
  cd backend && python manage.py runserver
  ```

### 5. Vercel Deployment
- [ ] Create/login to Vercel account (https://vercel.com)
- [ ] Connect GitHub repository
- [ ] Configure build settings in Vercel dashboard:
  - Build Command: Leave default or use `npm run vercel-build`
  - Output Directory: `frontend/dist`
  - Install Command: `npm install --prefix frontend && pip install -r backend/requirements.txt`
- [ ] Add environment variables in Vercel Settings
- [ ] Deploy project
- [ ] Wait for build to complete (5-10 minutes)

### 6. Post-Deployment
- [ ] Verify frontend loads at `https://your-project.vercel.app`
- [ ] Check API is working: `https://your-project.vercel.app/api/`
- [ ] Run migrations on Vercel:
  ```bash
  vercel env pull .env.production.local
  cd backend && python manage.py migrate
  ```
- [ ] Create superuser on Vercel database:
  ```bash
  cd backend && python manage.py createsuperuser
  ```
- [ ] Access admin at `https://your-project.vercel.app/admin/`
- [ ] Add your website content

### 7. Cus Custom Domain (Optional)
- [ ] Go to Vercel project Settings → Domains
- [ ] Add your custom domain
- [ ] Update DNS records as instructed by Vercel
- [ ] Update ALLOWED_HOSTS and CORS_ALLOWED_ORIGINS in Vercel env vars

### 8. Monitoring
- [ ] Enable Vercel analytics
- [ ] Set up error notifications
- [ ] Monitor Vercel logs for issues
- [ ] Test all website functionality in production

## Troubleshooting During Deployment

If something goes wrong:

1. **Check Vercel Logs**
   - Go to your project → Deployments
   - Click on failed deployment
   - View build logs for errors

2. **Test Locally First**
   ```bash
   # Ensure it builds locally
   cd frontend && npm run build
   
   # Ensure backend works
   cd backend && python manage.py makemigrations && python manage.py migrate
   ```

3. **Common Issues**
   - Missing packages: Add to `requirements.txt`
   - Database not found: Check DB connection string
   - CORS errors: Update CORS_ALLOWED_ORIGINS
   - Static files missing: Check frontend build output

## Recommended Next Steps After Deployment

1. Set up automated backups for database
2. Configure email for contact form
3. Set up analytics (Google Analytics)
4. Add sitemap.xml
5. Test from different devices/browsers
6. Enable HTTPS certificate (automatic on Vercel)

## Support

- Vercel Docs: https://vercel.com/docs
- Django Docs: https://docs.djangoproject.com
- REST Framework: https://www.django-rest-framework.org
- React: https://react.dev
