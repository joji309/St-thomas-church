# Production Environment Configuration

Complete guide for setting up your production environment.

## Environment Variables for Production

### Database Configuration

**Required for Vercel deployment:**

```env
# PostgreSQL Database (from Neon.tech)
DB_ENGINE=django.db.backends.postgresql
DB_NAME=neondb
DB_USER=neondb_owner
DB_PASSWORD=your-secure-password-here
DB_HOST=ep-xxxx.neon.tech
DB_PORT=5432
```

### Django Settings

```env
# Django Core
DEBUG=False
SECRET_KEY=your-super-secret-key-here

# Hosts & CORS
ALLOWED_HOSTS=st-thomas-tivim-goa.vercel.app,your-custom-domain.com
CORS_ALLOWED_ORIGINS=https://st-thomas-tivim-goa.vercel.app,https://your-custom-domain.com
```

### API Configuration (Optional)

```env
# Frontend API URL (defaults to /api if not set)
VITE_API_BASE_URL=https://st-thomas-tivim-goa.vercel.app/api

# Error Tracking (Optional - for Sentry or similar)
VITE_ERROR_TRACKING_URL=https://your-error-tracking-service.com/api/events
```

---

## How to Add Environment Variables to Vercel

### Step 1: Go to Vercel Dashboard
1. Visit: https://vercel.com/dashboard
2. Click your project: `st-thomas-tivim-goa`
3. Click **Settings** tab
4. Click **Environment Variables** (left sidebar)

### Step 2: Add Each Variable

For each variable above:
1. Click **"Add new variable"**
2. Fill in **Name** (e.g., `DB_PASSWORD`)
3. Fill in **Value** (e.g., your password)
4. Make sure **Environment** includes at least **Production**
5. Click **Save**

### Step 3: Redeploy

After adding all variables:
1. Go to **Deployments** tab
2. Click the **Redeploy** button
3. Select branch: **main**
4. Click **Redeploy**

---

## Environment Variable Reference

### Critical (Application Won't Work Without These)

| Variable | Example | Purpose |
|----------|---------|---------|
| `SECRET_KEY` | `django-insecure-a#x$8...` | Django session encryption |
| `DEBUG` | `False` | Disable debug mode in production |
| `DB_ENGINE` | `django.db.backends.postgresql` | Database type |
| `DB_NAME` | `neondb` | Database name |
| `DB_USER` | `neondb_owner` | Database username |
| `DB_PASSWORD` | `npg_abc123...` | Database password (KEEP SECRET!) |
| `DB_HOST` | `ep-floral-heart.neon.tech` | Database host |
| `DB_PORT` | `5432` | Database port |

### Important (Site Won't Load Without These)

| Variable | Example | Purpose |
|----------|---------|---------|
| `ALLOWED_HOSTS` | `st-thomas.vercel.app` | List of allowed hostnames |
| `CORS_ALLOWED_ORIGINS` | `https://st-thomas.vercel.app` | Allowed frontend domains |

### Optional (Nice to Have)

| Variable | Example | Purpose |
|----------|---------|---------|
| `VITE_API_BASE_URL` | `https://st-thomas.vercel.app/api` | Frontend API Base URL |
| `VITE_ERROR_TRACKING_URL` | `https://sentry.io/...` | Error tracking service |

---

## Generating a Secure SECRET_KEY

Run this command locally:

```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

**Example output:**
```
django-insecure-a#x$8@b!z9m*q^w&e1r%t2y3u4i5o6p7j8k9l0m-n1b2v3c4x5
```

Copy this entire string and paste as your `SECRET_KEY` in Vercel.

---

## PostgreSQL Connection String Format

**From Neon.tech:**
```
postgresql://neondb_owner:npg_fwejLOlS6Ey3@ep-floral-heart.neon.tech/neondb?sslmode=require
```

**Extract Values:**
```
DB_USER      = neondb_owner
DB_PASSWORD  = npg_fwejLOlS6Ey3
DB_HOST      = ep-floral-heart.neon.tech
DB_NAME      = neondb
DB_PORT      = 5432
DB_ENGINE    = django.db.backends.postgresql
```

---

## Verification Checklist

After setting all variables and redeploying:

- [ ] All 10 environment variables are set in Vercel
- [ ] Website loads at https://st-thomas-tivim-goa.vercel.app
- [ ] No errors in browser console (F12)
- [ ] API calls work (check Network tab)
- [ ] Admin panel accessible at `/admin`
- [ ] Database connection successful
- [ ] Static files load (CSS, JS, images)

### Test Database Connection

Visit: `/api/` endpoint
- Should show API root (not 500 error)
- Means database is connected

---

## Security Best Practices

### DO ✅

- ✅ Store credentials in Vercel environment variables
- ✅ Use strong, random SECRET_KEYs
- ✅ Rotate SECRET_KEY annually
- ✅ Never commit `.env` files to Git
- ✅ Use HTTPS only (enforced in production)
- ✅ Keep database password hidden
- ✅ Monitor deployment logs regularly
- ✅ Use Neon's automated backups

### DON'T ❌

- ❌ Don't commit credentials to Git
- ❌ Don't hardcode database passwords in code
- ❌ Don't share SECRET_KEY with anyone
- ❌ Don't use weak passwords
- ❌ Don't enable DEBUG in production
- ❌ Don't use default credentials
- ❌ Don't expose connection strings publicly

---

## Local Development vs Production

### Local (`.env`)
```env
DEBUG=True
DB_ENGINE=django.db.backends.sqlite3
DB_NAME=db.sqlite3
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

### Production (Vercel Environment Variables)
```env
DEBUG=False
DB_ENGINE=django.db.backends.postgresql
DB_NAME=neondb
DB_USER=neondb_owner
DB_HOST=ep-floral-heart.neon.tech
ALLOWED_HOSTS=st-thomas-tivim-goa.vercel.app
CORS_ALLOWED_ORIGINS=https://st-thomas-tivim-goa.vercel.app
```

---

## Troubleshooting Environment Variables

### Issue: "Environment variable not found" error

**Solution:**
1. Check you added the variable to **Production** environment
2. Redeploy after adding (Deployments → Redeploy)
3. Check exact spelling (variables are case-sensitive)

### Issue: Database connection fails

**Solution:**
1. Verify credentials are correct (copy from Neon again)
2. Check `DB_HOST` doesn't include `?sslmode=require` part
3. Test connection locally first
4. Check Neon database is running

### Issue: CORS errors in browser

**Solution:**
1. Update `CORS_ALLOWED_ORIGINS` to include your domain
2. Make sure URL starts with `https://` (not `http://`)
3. Redeploy after changing
4. Wait 2-3 minutes for changes to take effect

---

## Next Steps

1. ✅ Add all environment variables to Vercel
2. ✅ Redeploy your project
3. ✅ Visit your production site
4. ✅ Monitor logs for errors
5. ✅ Test all features

## Need Help?

- 📖 Read: [PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md)
- 🚀 Deploy: [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md)
- 📞 Support: Check Vercel logs for errors
