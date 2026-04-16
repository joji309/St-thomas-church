import os
import sys
from pathlib import Path

# Set up paths immediately
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))
sys.path.insert(0, str(BASE_DIR / 'backend'))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'server.settings')

# Use /tmp for static files — it's writable on Vercel serverless
STATIC_ROOT = '/tmp/staticfiles'
os.environ['STATIC_ROOT'] = STATIC_ROOT

# Run collectstatic once per cold start into /tmp
if not os.path.exists(os.path.join(STATIC_ROOT, 'admin')):
    try:
        import django
        django.setup()
        from django.core.management import call_command
        os.makedirs(STATIC_ROOT, exist_ok=True)
        call_command('collectstatic', '--noinput', verbosity=0)
    except Exception as e:
        print(f"WARNING: collectstatic failed: {e}")

app = None

try:
    from django.core.wsgi import get_wsgi_application
    app = get_wsgi_application()
except Exception as e:
    print(f"CRITICAL: Django initialization failed: {e}")
    raise e
