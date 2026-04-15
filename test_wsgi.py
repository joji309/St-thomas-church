import os
import sys
from pathlib import Path

# Add the backend directory to the sys.path
BASE_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(BASE_DIR / 'backend'))

# Set environment variables
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'server.settings')

try:
    from django.core.wsgi import get_wsgi_application
    print("Attempting to get WSGI application...")
    application = get_wsgi_application()
    print("SUCCESS: WSGI application loaded successfully!")
except Exception as e:
    import traceback
    print("FAILED: WSGI application failed to load.")
    traceback.print_exc()
    sys.exit(1)
