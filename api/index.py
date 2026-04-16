import os
import sys
from pathlib import Path

# Set up paths immediately
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))
sys.path.insert(0, str(BASE_DIR / 'backend'))

# /tmp is the only writable dir in Vercel serverless — use it for static files
os.environ['STATIC_ROOT'] = '/tmp/staticfiles'
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'server.settings')

app = None

try:
    import django
    django.setup()

    # Run collectstatic once per cold start (only if files not already there)
    static_root = '/tmp/staticfiles'
    if not os.path.exists(os.path.join(static_root, 'admin', 'css', 'base.css')):
        print("Running collectstatic to /tmp/staticfiles...")
        from django.core.management import call_command
        os.makedirs(static_root, exist_ok=True)
        try:
            call_command('collectstatic', '--noinput', verbosity=1)
            print("collectstatic completed successfully.")
        except Exception as ce:
            print(f"WARNING: collectstatic failed: {ce}")

    from django.core.wsgi import get_wsgi_application
    app = get_wsgi_application()

except Exception as e:
    print(f"CRITICAL: Django initialization failed: {e}")
    raise e
