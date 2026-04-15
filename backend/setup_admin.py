#!/usr/bin/env python
"""
Quick admin setup and migration script for Vercel deployment
Usage:
    python setup_admin.py
"""

import os
import django
import sys
from pathlib import Path

# Add backend to path
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'server.settings')
django.setup()

from django.core.management import execute_from_command_line
from django.contrib.auth.models import User

def main():
    """Run migrations and create superuser if needed"""
    
    # Run migrations
    print("Running database migrations...")
    execute_from_command_line(['manage.py', 'migrate'])
    
    # Check if admin exists
    admin_user = User.objects.filter(username='admin').first()
    if not admin_user:
        print("\nCreating superuser...")
        User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='admin12345'
        )
        print("Superuser created!")
    else:
        print("\nAdmin already exists, updating password...")
        admin_user.set_password('admin12345')
        admin_user.save()
        print("Password updated to: admin12345")
    
    print("   Username: admin")
    print("   Password: admin12345")
    
    print("\nSetup complete!")
    print("Next steps:")
    print("   1. Go to /admin/ and log in")
    print("   2. Add your site content")
    print("   3. Update the password if using default")

if __name__ == '__main__':
    main()
