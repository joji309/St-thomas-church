"""
Vercel serverless function handler for Django REST API
This serves all API requests for the St. Thomas Church website
"""

import os
import sys
import django
from pathlib import Path

# Add backend to path
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR / 'backend'))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'server.settings')
django.setup()

from django.core.wsgi import get_wsgi_application

# Get the WSGI application
app = get_wsgi_application()


def handler(request, response):
    """
    Vercel serverless function handler (updated for Python 3.12)
    Routes all requests through Django WSGI
    """
    # Call the Django WSGI app
    return app(request, response)
