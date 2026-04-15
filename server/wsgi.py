import os
import sys
from pathlib import Path

# Add the backend directory to the sys.path so Django can find 'server.settings'
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR / 'backend'))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'server.settings')

from django.core.wsgi import get_wsgi_application

application = get_wsgi_application()

# Vercel looks for a top-level 'app' variable
app = application
