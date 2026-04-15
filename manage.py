#!/usr/bin/env python
import os
import sys

if __name__ == "__main__":
    # Add backend to path so we can find the settings
    sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))
    
    # Path to the real manage.py
    manage_py_path = os.path.join(os.path.dirname(__file__), 'backend', 'manage.py')
    
    # Re-exec with the same arguments but pointing to the real manage.py
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "server.settings")
    
    # Actually, it's easier to just import and run the main from backend/manage.py
    # But some scripts expect manage.py to be in the current directory.
    # So we'll just run it.
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed/available on your PYTHONPATH?"
        ) from exc
    execute_from_command_line(sys.argv)
