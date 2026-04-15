import os
import sys
from pathlib import Path

# Add backend to path
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR / 'backend'))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'server.settings')

try:
    from django.core.wsgi import get_wsgi_application
    application = get_wsgi_application()
    # Export it as 'app' and 'application' to be safe
    app = application
except Exception:
    import traceback
    def app(environ, start_response):
        start_response('500 Internal Server Error', [('Content-Type', 'text/plain')])
        return [f"WSGI failed to start.\n\n{traceback.format_exc()}".encode()]
    application = app
