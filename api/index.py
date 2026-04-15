import os
import sys
import traceback
from pathlib import Path

# Add the backend directory to the sys.path
# This allows Django to find the 'server' module and any apps inside 'backend'
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR / 'backend'))

# Set environment variables
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'server.settings')

def app(environ, start_response):
    try:
        from django.core.wsgi import get_wsgi_application
        application = get_wsgi_application()
        return application(environ, start_response)
    except Exception:
        import traceback
        start_response('500 Internal Server Error', [('Content-Type', 'text/plain')])
        status_msg = f"Django failed to start.\n\n{traceback.format_exc()}"
        return [status_msg.encode()]
