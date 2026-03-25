# Troubleshooting Guide

## Common Issues and Solutions

### 1. Build Fails on Vercel

**Error Message**: "Command failed `npm run vercel-build`" or similar

**Solutions**:
1. Check the full error in Vercel Logs:
   - Go to your project → Deployments
   - Click the failed deployment
   - Expand the error message

2. **Missing Node.js packages**:
   ```bash
   # Ensure frontend/package.json has all dependencies
   cd frontend && npm install  # This should not add anything new
   ```

3. **Missing Python packages**:
   ```bash
   # Check all imports in backend are in requirements.txt
   grep -r "^import\|^from" backend/ | grep -v "__pycache__"
   # Add missing packages to requirements.txt
   ```

4. **Build script issue**:
   ```bash
   # Test the build locally
   npm run vercel-build
   ```

### 2. API Not Working / 404 Errors

**Error Message**: `GET /api/* 404` or API returns empty

**Solutions**:

1. **Verify serverless function is deployed**:
   - Check Vercel Deployment → Functions
   - Should see `api/index.py`

2. **Check Django settings**:
   ```bash
   # Verify settings match environment
   vercel env pull .env.production.local
   cat .env.production.local | grep ALLOWED_HOSTS
   ```

3. **Verify CORS configuration**:
   - In Vercel env vars, check `CORS_ALLOWED_ORIGINS`
   - Should include your Vercel domain
   - Check browser console for CORS errors

4. **Test API directly**:
   ```bash
   # Replace your-domain with your actual domain
   curl https://your-domain.vercel.app/api/
   # Should return API root or 200 response
   ```

### 3. "Connection Refused" or "Cannot Connect to Database"

**Error Message**: `psycopg2.OperationalError: connection failed`

**Solutions**:

1. **Verify database environment variables**:
   ```bash
   vercel env pull .env.production.local
   # Check these exist and are correct:
   # DB_ENGINE, DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT
   ```

2. **Test database connection locally**:
   ```bash
   # Copy Vercel env vars
   vercel env pull .env.test
   
   # Test file
   cat > test_db.py << 'EOF'
   import os
   import psycopg2
   from decouple import config
   
   try:
       conn = psycopg2.connect(
           host=config('DB_HOST'),
           user=config('DB_USER'),
           password=config('DB_PASSWORD'),
           database=config('DB_NAME')
       )
       print("✅ Database connection successful!")
       conn.close()
   except Exception as e:
       print(f"❌ Connection failed: {e}")
   EOF
   python test_db.py
   ```

3. **Database might not exist**:
   - Verify database is created in your hosting provider
   - For Neon, Supabase, etc., check dashboard

4. **Network access issue**:
   - Check database allows connection from Vercel IPs
   - In AWS RDS, check security group rules
   - In Neon, check IP whitelist settings

### 4. Static Files Not Loading (404 on /static/)

**Error Message**: CSS/JS files return 404

**Solutions**:

1. **Verify frontend was built**:
   ```bash
   # Check frontend/dist exists and has files
   ls -la frontend/dist/
   # Should see: index.html, assets/, etc.
   ```

2. **Force rebuild**:
   ```bash
   cd frontend && npm run build
   git add .
   git commit -m "Rebuild frontend"
   git push
   # Vercel will auto-redeploy
   ```

3. **Check staticfiles configuration**:
   - In Vercel env, set: `STATIC_ROOT=staticfiles`
   - Verify WhiteNoise is in MIDDLEWARE

4. **Clear Vercel cache**:
   - Go to Settings → Git
   - Click "Redeploy" or make a new commit

### 5. "Module not found" Errors

**Error Message**: `ModuleNotFoundError: No module named 'xyz'`

**Solutions**:

1. **Add package to requirements.txt**:
   ```bash
   # Check what's missing in the error message
   echo "missing-package==1.0.0" >> backend/requirements.txt
   git add backend/requirements.txt
   git commit -m "Add missing package"
   git push
   ```

2. **Install packages locally to verify**:
   ```bash
   cd backend
   pip install -r requirements.txt
   python manage.py shell -c "import missing_module"
   ```

3. **Check Python path issues**:
   - In api/index.py, verify sys.path is correct
   - Should include backend directory

### 6. Admin Panel Doesn't Work / Migration Errors

**Error Message**: `ProgrammingError: relation does not exist` or admin returns 404

**Solutions**:

1. **Run migrations on production database**:
   ```bash
   vercel env pull .env.production.local
   cd backend
   python manage.py migrate --verbosity 2
   ```

2. **Create superuser if needed**:
   ```bash
   cd backend
   python manage.py createsuperuser
   # Follow prompts to create admin user
   ```

3. **Check migration status**:
   ```bash
   cd backend
   python manage.py showmigrations
   # All should show [X] if applied
   ```

### 7. CORS Errors in Browser Console

**Error Message**: `Access to XMLHttpRequest blocked by CORS policy`

**Solutions**:

1. **Update CORS_ALLOWED_ORIGINS**:
   In Vercel Settings → Environment Variables:
   ```
   CORS_ALLOWED_ORIGINS=https://your-domain.vercel.app,https://your-custom-domain.com
   ```

2. **Redeploy after changing**:
   ```bash
   git commit --allow-empty -m "Trigger redeploy for CORS"
   git push
   ```

3. **Check browser console**:
   - Open DevTools (F12)
   - Go to Console tab
   - Look for CORS error details
   - Note the exact URL causing error

4. **Verify frontend and backend domains match**:
   - Frontend should be: https://your-domain.vercel.app
   - Backend should be: same domain, /api/ path
   - Both protocols must be HTTPS

### 8. Site Very Slow / Timeouts / 504 Gateway Timeout

**Error Message**: Website takes >30 seconds or times out

**Solutions**:

1. **Check database performance**:
   - Verify database is responsive
   - Check for slow queries
   - Database latency adds to request time

2. **Check Vercel Function memory**:
   - Increase memory in vercel.json:
   ```json
   "functions": {
     "api/index.py": {
       "memory": 3008,
       "maxDuration": 60
     }
   }
   ```

3. **Optimize Django queries**:
   - Use .select_related() and .prefetch_related()
   - Add database indexes
   - Cache expensive queries

4. **Check for infinite loops**:
   - Look at Vercel logs
   - Check backend code for any loops/blocking calls

### 9. "SECRET_KEY not set" Error

**Error Message**: `KeyError: 'SECRET_KEY'` or similar

**Solutions**:

1. **Add SECRET_KEY to environment**:
   In Vercel Settings → Environment Variables:
   ```
   SECRET_KEY=your-very-long-secure-random-string
   ```

2. **Generate secure key**:
   ```bash
   python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
   ```

3. **Ensure it's different from development key**
   - Never use `django-insecure-...` in production

### 10. Custom Domain Not Working / DNS Issues

**Error Message**: Domain shows Vercel default page or doesn't load

**Solutions**:

1. **Verify domain added in Vercel**:
   - Project Settings → Domains
   - Should show "Valid"

2. **Check DNS records**:
   - Vercel provides exact DNS config to add
   - Update your domain registrar (GoDaddy, Namecheap, etc.)
   - DNS changes take 5-30 minutes to propagate
   - Use `nslookup` or `dig` to verify:
   ```bash
   nslookup your-domain.com
   # Should show Vercel's IP
   ```

3. **Update environment variables**:
   ```
   ALLOWED_HOSTS=your-domain.com,www.your-domain.com,your-project.vercel.app
   CORS_ALLOWED_ORIGINS=https://your-domain.com,https://www.your-domain.com
   ```

4. **SSL Certificate**:
   - Vercel auto-generates (takes few minutes)
   - Wait for green checkmark in Domains

## Checking Logs

### Vercel Web Logs
```bash
# View real-time logs
vercel logs --follow

# View specific deployment
vercel logs <url>
```

### Local Django Logs
```bash
# Test migrations
cd backend && python manage.py migrate --verbosity 3

# Test startup
python manage.py runserver

# Test imports
python -c "import server.settings; print('✅ Settings loaded')"
```

### Database Logs
- Check your database provider's dashboard
- Neon: Project → Logs
- Supabase: Logs → Database Logs
- AWS RDS: CloudWatch → Logs

## Emergency Rollback

If everything breaks:

```bash
# Revert last commit
git log --oneline -5  # Find good commit
git revert HEAD       # Or git reset --hard <good-commit>
git push

# Vercel auto-redeploys from main branch
```

## Getting More Help

1. **Check Vercel Status**: https://www.vercelstatus.com/
2. **Django Deployment Guide**: https://docs.djangoproject.com/en/6.0/howto/deployment/
3. **Vercel Community**: https://vercel.com/support
4. **Django Discord**: https://discord.gg/6jqkR3t

---

**Still stuck?** Check the [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md) for more detailed information.
