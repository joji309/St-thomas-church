import os
import sys
from pathlib import Path
import django
from django.core.wsgi import get_wsgi_application

# Add the backend directory to the sys.path
# This allows Django to find the 'server' module and any apps inside 'backend'
BASE_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(BASE_DIR / 'backend'))

# Set environment variables
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'server.settings')

# Initialize Django
# django.setup() # get_wsgi_application() calls this

# Export the WSGI application as 'app' for Vercel
app = get_wsgi_application()
