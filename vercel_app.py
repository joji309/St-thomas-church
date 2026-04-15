import os
import sys
import traceback
from pathlib import Path

def app(environ, start_response):
    try:
        from django.core.wsgi import get_wsgi_application
        
        # Add the backend directory to the sys.path
        BASE_DIR = Path(__file__).resolve().parent
        sys.path.insert(0, str(BASE_DIR / 'backend'))
        
        # Set environment variables
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'server.settings')
        
        # Export the WSGI application
        application = get_wsgi_application()
        return application(environ, start_response)
        
    except Exception:
        start_response('500 Internal Server Error', [('Content-Type', 'text/plain')])
        status_msg = f"Django failed to start.\n\n{traceback.format_exc()}"
        return [status_msg.encode()]
