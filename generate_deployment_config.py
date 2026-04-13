#!/usr/bin/env python3

"""
Generate SECRET_KEY and other deployment helpers for Render
"""

import os
import secrets
from pathlib import Path

def generate_secret_key():
    """Generate a Django SECRET_KEY"""
    try:
        from django.core.management.utils import get_random_secret_key
        secret_key = get_random_secret_key()
        return secret_key
    except ImportError:
        # Fallback if Django is not installed
        return secrets.token_urlsafe(50)

def main():
    print("=" * 70)
    print("RENDER DEPLOYMENT - CONFIGURATION GENERATOR")
    print("=" * 70)
    print()
    
    # Generate SECRET_KEY
    print("Generating Django SECRET_KEY...")
    secret_key = generate_secret_key()
    print()
    print("✓ SECRET_KEY generated (copy this to Render dashboard):")
    print()
    print(f"  {secret_key}")
    print()
    print("=" * 70)
    print()
    
    # Ask if user wants to create .env file
    print("Do you want to create a .env file for local testing? (y/n)")
    choice = input("> ").strip().lower()
    
    if choice == 'y':
        env_content = f"""# Local Development Environment Variables
DEBUG=True
SECRET_KEY={secret_key}
ALLOWED_HOSTS=localhost,127.0.0.1

# Database (local SQLite)
DB_ENGINE=django.db.backends.sqlite3
DB_NAME=db.sqlite3

# CORS (for development)
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
"""
        
        if os.path.exists('.env'):
            print("\n.env already exists. Overwrite? (y/n)")
            if input("> ").strip().lower() != 'y':
                print("Skipped creating .env")
                return
        
        with open('.env', 'w') as f:
            f.write(env_content)
        
        print("✓ .env file created")
        print()
        print("Note: This .env is for LOCAL DEVELOPMENT ONLY")
        print("For Render, set environment variables in the dashboard")
        print()
    
    # Print environment variables needed for Render
    print("=" * 70)
    print("ENVIRONMENT VARIABLES FOR RENDER DASHBOARD")
    print("=" * 70)
    print()
    
    env_vars = {
        "CORE SETTINGS": [
            ("DEBUG", "False"),
            ("SECRET_KEY", secret_key),
            ("ALLOWED_HOSTS", "st-thomas-church-XXXXX.onrender.com"),
        ],
        "DATABASE": [
            ("DB_ENGINE", "django.db.backends.postgresql"),
            ("DB_NAME", "neondb"),
            ("DB_USER", "neondb_owner"),
            ("DB_PASSWORD", "(your Neon password)"),
            ("DB_HOST", "(your Neon host)"),
            ("DB_PORT", "5432"),
        ],
        "CORS": [
            ("CORS_ALLOWED_ORIGINS", "https://st-thomas-church-XXXXX.onrender.com"),
        ],
    }
    
    for category, vars_list in env_vars.items():
        print(f"\n{category}:")
        print("-" * 70)
        for key, value in vars_list:
            print(f"  {key:<30} = {value}")
    
    print()
    print("=" * 70)
    print()
    print("Instructions:")
    print()
    print("1. Copy SECRET_KEY from above")
    print("2. Set up PostgreSQL database (Neon recommended)")
    print("3. Go to https://dashboard.render.com")
    print("4. Create Web Service and set all environment variables")
    print("5. Deploy!")
    print()

if __name__ == '__main__':
    main()
