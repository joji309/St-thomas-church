import os
import sys
import traceback
from pathlib import Path

# Log start for Vercel
print("--- Initializing api/index.py ---")

# Add the backend directory to the sys.path
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR / 'backend'))

# Set environment variables
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'server.settings')

try:
    from django.core.wsgi import get_wsgi_application
    print("--- Loaded get_wsgi_application ---")
    application = get_wsgi_application()
    print("--- Django application initialized ---")
    
    # Standard Vercel handler
    def app(environ, start_response):
        return application(environ, start_response)
        
except Exception:
    error_msg = traceback.format_exc()
    print(f"--- Initialization failed: {error_msg} ---")
    def app(environ, start_response):
        start_response('500 Internal Server Error', [('Content-Type', 'text/plain')])
        return [f"Django failed to start.\n\n{error_msg}".encode()]
