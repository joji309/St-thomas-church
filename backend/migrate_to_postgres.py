#!/usr/bin/env python
"""
Migration script to move data from SQLite to PostgreSQL
Usage:
    1. Set your PostgreSQL connection in .env first (DB_ENGINE, DB_NAME, DB_USER, etc.)
    2. Run: python migrate_to_postgres.py
"""

import os
import django
import json
from pathlib import Path
from django.core import management

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'server.settings')
django.setup()

from django.core.management import call_command
from django.db import connections
from api.models import *

def backup_sqlite_data():
    """Dump all data from SQLite to JSON"""
    print("📦 Backing up SQLite data to JSON fixtures...")
    
    fixtures_dir = Path(__file__).parent / 'fixtures'
    fixtures_dir.mkdir(exist_ok=True)
    
    # Dump all app data
    try:
        call_command('dumpdata', 'api', indent=2, output=str(fixtures_dir / 'api_data.json'))
        print("✅ API data backed up to backend/fixtures/api_data.json")
        return True
    except Exception as e:
        print(f"❌ Error backing up data: {e}")
        return False

def display_migration_steps():
    """Display the steps needed to complete migration"""
    print("\n" + "="*60)
    print("📋 PostgreSQL MIGRATION STEPS")
    print("="*60)
    
    print("""
✅ STEP 1: Create PostgreSQL database (DONE - you have Neon connection string)
✅ STEP 2: Backup SQLite data (DONE - saved to backend/fixtures/api_data.json)

📌 STEP 3: Update your .env file with PostgreSQL credentials:
   DB_ENGINE=django.db.backends.postgresql
   DB_NAME=your_db_name
   DB_USER=your_user
   DB_PASSWORD=your_password
   DB_HOST=your_host
   DB_PORT=5432

📌 STEP 4: Run these commands:
   cd backend
   python manage.py migrate           # Create tables in PostgreSQL
   python manage.py loaddata fixtures/api_data.json  # Load backed up data

📌 STEP 5: Verify data:
   python manage.py shell
   >>> from api.models import *
   >>> print(f"Total posts: {Post.objects.count()}")
   >>> print(f"Total images: {GalleryImage.objects.count()}")
    """)
if __name__ == '__main__':
    print("🚀 Starting SQLite to PostgreSQL migration...")
    print()
    
    # Backup data
    if backup_sqlite_data():
        display_migration_steps()
        print("\n✨ Backup complete! Follow the steps above to finish migration.")
    else:
        print("\n❌ Migration failed. Please check your database connections.")
