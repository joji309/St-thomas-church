# Vercel Deployment Guide - St. Thomas Church Website

This guide walks you through deploying both the React (Vite) frontend and Django backend to Vercel.

## ⚠️ Important: Django on Vercel Limitations

Vercel is **optimized for static sites and lightweight serverless functions**. Deploying a full Django application has these limitations:

1. **No local file storage** - Use cloud storage (AWS S3, Cloudinary) for media files.
2. **Stateless execution** - Database must be external (PostgreSQL, not SQLite).
3. **Cold starts** - First request after inactivity may be slow.
4. **Timeout limits** - 60 seconds per request by default.

---

## 1. Prerequisites

1. **Vercel Account**: Sign up at https://vercel.com
2. **PostgreSQL Database**: Use **Neon.tech**, **Supabase**, or **Railway**. SQLite will NOT work.
3. **Cloud Storage**: Use **Cloudinary** (recommended for images) or **S3**.

## 2. Environment Variables

Configure these in the Vercel Dashboard (**Project Settings > Environment Variables**):

| Variable | Recommended Value |
| :--- | :--- |
| `SECRET_KEY` | A long random string |
| `DATABASE_URL` | `postgres://user:pass@host:5432/dbname` |
| `DEBUG` | `False` |
| `ALLOWED_HOSTS` | `your-app.vercel.app` |
| `CORS_ALLOWED_ORIGINS` | `https://your-app.vercel.app` |
| `DJANGO_SETTINGS_MODULE` | `server.settings` |

## 3. Deployment Steps

### Option A: Via GitHub (Recommended)
1. Push your code to a GitHub repository.
2. In Vercel, click **"Add New Project"**.
3. Import your repository.
4. Vercel will automatically read `vercel.json`.
5. Add your Environment Variables.
6. Click **Deploy**.

### Option B: Via Vercel CLI
```bash
# Install CLI
npm install -g vercel

# Deploy
vercel --prod
```

## 4. Running Migrations

Since Vercel functions are read-only, you must run migrations against the remote database from your local machine.

1. Install the Vercel CLI.
2. Run `vercel env pull .env.production.local` to get the production environment variables locally.
3. In the `backend` folder, run:
   ```bash
   pip install -r requirements.txt
   python manage.py migrate
   ```

## 5. Media Files (Images)

By default, this project uses local storage. On Vercel, uploaded images will disappear.
To fix this, update `backend/server/settings.py` to use `django-storages` with Cloudinary or S3.

## 6. Troubleshooting

- **404 on API**: Check `vercel.json` rewrites.
- **500 Error**: Check **Functions Logs** in the Vercel dashboard.
- **Static Assets fail**: Ensure `frontend/vite.config.js` has `base: '/'`.
