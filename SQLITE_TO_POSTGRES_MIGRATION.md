# SQLite to PostgreSQL Migration Guide

This guide walks you through migrating your St. Thomas Church database from SQLite to PostgreSQL.

## Why PostgreSQL?

- ✅ **Vercel Compatible** - Vercel doesn't support persistent local storage (SQLite)
- ✅ **Production Ready** - Better for scaling and concurrent users
- ✅ **Cloud Based** - Easy to backup and manage
- ✅ **Free Options** - Neon.tech offers free PostgreSQL hosting

---

## Prerequisites

1. **Python** - Already installed on your machine
2. **Git** - For version control
3. **Neon Account** - Create one at https://neon.tech (free)

---

## Migration Steps

### Step 1: Create PostgreSQL Database on Neon

1. Go to [https://neon.tech](https://neon.tech)
2. Click **Sign Up** (free)
3. Click **Create a new project**
4. Choose your region (pick one close to you)
5. Click **Create project**
6. You'll see a connection string like:
   ```
   postgresql://neondb_owner:abc123@ep-XXX.neon.tech/neondb?sslmode=require
   ```
7. **Copy this entire string** - you'll need it!

---

### Step 2: Install PostgreSQL Adapter (if needed)

Your project already has `psycopg2-binary` in `requirements.txt`, so you should be good!

If not, run:
```bash
pip install psycopg2-binary
```

---

### Step 3: Create Configuration File

1. **Copy the .env template:**
   ```bash
   copy .env.postgres.example .env
   ```

2. **Edit `.env` with your PostgreSQL credentials:**
   ```
   # From your Neon connection string: postgresql://user:password@host/dbname?sslmode=require
   DB_ENGINE=django.db.backends.postgresql
   DB_NAME=neondb
   DB_USER=neondb_owner
   DB_PASSWORD=abc123...
   DB_HOST=ep-XXX.neon.tech
   DB_PORT=5432
   DEBUG=False
   SECRET_KEY=[generate a key below]
   ```

3. **Generate a SECRET_KEY:**
   ```bash
   python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
   ```
   Copy the output and paste it as your `SECRET_KEY` in `.env`

---

### Step 4: Backup SQLite Data

```bash
cd backend
python migrate_to_postgres.py
```

This will:
- ✅ Export all data from SQLite to `backend/fixtures/api_data.json`
- ✅ Create the fixtures directory
- ✅ Show you the next steps

**You should see:**
```
📦 Backing up SQLite data to JSON fixtures...
✅ API data backed up to backend/fixtures/api_data.json
```

---

### Step 5: Run Migrations

Now tell Django to create all tables in PostgreSQL:

```bash
cd backend
python manage.py migrate
```

You should see:
```
Operations to perform:
  Apply all migrations: admin, auth, contenttypes, sessions, api
Running migrations:
  Applying contenttypes.0001_initial... OK
  Applying auth.0001_initial... OK
  ...
```

---

### Step 6: Load Your Data Back

Load the backed-up data into PostgreSQL:

```bash
cd backend
python manage.py loaddata fixtures/api_data.json
```

You should see:
```
Installed 45 object(s) from 1 fixture(s)
```

---

### Step 7: Create Admin User

Create a superuser for the admin panel:

```bash
cd backend
python manage.py createsuperuser
```

You'll be prompted for:
- **Username**: admin
- **Email**: your-email@example.com
- **Password**: (create a strong password)

---

### Step 8: Verify Everything Works

```bash
# Start Django development server
cd backend
python manage.py runserver

# In another terminal, start React frontend
cd frontend
npm run dev
```

Then:
1. Open http://localhost:5173 - your frontend should work!
2. Open http://localhost:8000/admin - login with your admin credentials
3. Verify all your data is there!

---

## Troubleshooting

### Error: "could not translate host name"
- **Check**: Your `DB_HOST` is correct (copy from Neon again)
- **Solution**: Make sure you have internet connection and the host exists

### Error: "FATAL: password authentication failed"
- **Check**: Your `DB_USER` and `DB_PASSWORD` exactly match Neon
- **Solution**: Copy them again from the Neon connection string carefully

### Error: "relation 'api_xxx' does not exist"
- **Solution**: You likely didn't run Step 5 (migrations) yet
- Run: `python manage.py migrate`

### Error: "No such table: api_xxx" (during data load)
- **Solution**: Run migrations first: `python manage.py migrate`
- Then load data: `python manage.py loaddata fixtures/api_data.json`

### Migrations not running in Vercel
- **Solution**: Vercel build environment won't run migrations automatically
- See: [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md) for post-deployment steps

---

## Next Steps: Deploy to Vercel

Once you've verified locally:

1. **Commit your changes:**
   ```bash
   git add .env .gitignore backend/fixtures/
   git commit -m "Switch to PostgreSQL database"
   git push
   ```

2. **Add environment variables to Vercel:**
   - Go to your Vercel project
   - Settings → Environment Variables
   - Add all your `.env` variables from Step 3

3. **Deploy:**
   - Click Deploy in Vercel dashboard

4. **Run migrations on Vercel:**
   ```bash
   vercel env pull .env.production.local
   cd backend
   python manage.py migrate --settings=server.settings
   python manage.py createsuperuser --settings=server.settings
   ```

---

## Keeping Your SQLite Backup

Your original SQLite database is safe! It's still at `backend/db.sqlite3`. You can:
- Keep it as a local backup (add to `.gitignore`)
- Delete it after verifying PostgreSQL works
- It won't affect anything while using PostgreSQL

---

## Questions?

- 📖 Check [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md)
- 📋 Review [PRE_DEPLOYMENT_CHECKLIST.md](./PRE_DEPLOYMENT_CHECKLIST.md)
- 🚀 See [QUICK_START.md](./QUICK_START.md) for deployment guide
