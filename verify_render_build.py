#!/usr/bin/env python3

"""
Local Build Verification Script for Render Deployment
This script simulates the Render build process locally to catch errors early
"""

import os
import sys
import subprocess
from pathlib import Path

# Colors for terminal output
class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    END = '\033[0m'

def print_success(msg):
    print(f"{Colors.GREEN}✓ {msg}{Colors.END}")

def print_error(msg):
    print(f"{Colors.RED}✗ {msg}{Colors.END}")

def print_warning(msg):
    print(f"{Colors.YELLOW}⚠ {msg}{Colors.END}")

def print_info(msg):
    print(f"{Colors.BLUE}ℹ {msg}{Colors.END}")

def run_command(cmd, description, cwd=None):
    """Run a command and return success status"""
    print(f"\n{description}...")
    try:
        result = subprocess.run(cmd, shell=True, cwd=cwd, capture_output=False, text=True)
        if result.returncode == 0:
            print_success(f"{description} completed")
            return True
        else:
            print_error(f"{description} failed with return code {result.returncode}")
            return False
    except Exception as e:
        print_error(f"{description} failed: {str(e)}")
        return False

def verify_files():
    """Verify required files exist"""
    print(f"\n{Colors.BLUE}=== Verifying Required Files ==={Colors.END}")
    
    required_files = [
        'render.yaml',
        'Procfile',
        'backend/requirements.txt',
        'backend/server/settings.py',
        'backend/manage.py',
        'frontend/package.json',
        'frontend/vite.config.js',
        '.gitignore',
    ]
    
    all_exist = True
    for file_path in required_files:
        if os.path.exists(file_path):
            print_success(f"Found: {file_path}")
        else:
            print_error(f"Missing: {file_path}")
            all_exist = False
    
    return all_exist

def verify_git():
    """Verify git status"""
    print(f"\n{Colors.BLUE}=== Verifying Git Status ==={Colors.END}")
    
    result = subprocess.run('git status --porcelain', shell=True, capture_output=True, text=True)
    
    if result.returncode != 0:
        print_error("Git not initialized or not in repo")
        return False
    
    if result.stdout.strip():
        print_warning("Uncommitted changes detected:")
        print(result.stdout)
        print_warning("Consider committing changes before deploying")
        return False
    else:
        print_success("Git working directory clean")
        return True

def check_environment_code():
    """Check if environment variable code is installed"""
    print(f"\n{Colors.BLUE}=== Checking Environment Variables ==={Colors.END}")
    
    # Check if python-decouple is available
    try:
        import decouple
        print_success("python-decouple available")
        return True
    except ImportError:
        print_warning("python-decouple not found - will be installed during Render build")
        return True  # Not critical, will be installed

def verify_requirements():
    """Verify requirements.txt has essential packages"""
    print(f"\n{Colors.BLUE}=== Verifying requirements.txt ==={Colors.END}")
    
    required_packages = [
        'Django',
        'djangorestframework',
        'psycopg2-binary',
        'gunicorn',
        'whitenoise',
    ]
    
    try:
        with open('backend/requirements.txt', 'r') as f:
            content = f.read()
        
        all_present = True
        for package in required_packages:
            if package.lower() in content.lower():
                print_success(f"Found: {package}")
            else:
                print_error(f"Missing: {package}")
                all_present = False
        
        return all_present
    except Exception as e:
        print_error(f"Could not read requirements.txt: {str(e)}")
        return False

def main():
    print(f"\n{Colors.BLUE}╔════════════════════════════════════════════════════════╗{Colors.END}")
    print(f"{Colors.BLUE}║  RENDER DEPLOYMENT - LOCAL BUILD VERIFICATION         ║{Colors.END}")
    print(f"{Colors.BLUE}║  St. Thomas Church Website                            ║{Colors.END}")
    print(f"{Colors.BLUE}╚════════════════════════════════════════════════════════╝{Colors.END}")
    
    # Verify initial state
    files_ok = verify_files()
    git_ok = verify_git()
    env_ok = check_environment_code()
    req_ok = verify_requirements()
    
    if not all([files_ok, git_ok, req_ok]):
        print(f"\n{Colors.RED}Some checks failed. Please fix issues before deploying.{Colors.END}")
        sys.exit(1)
    
    # Simulate Render build process
    print(f"\n{Colors.BLUE}=== Simulating Render Build Process ==={Colors.END}")
    
    build_steps = [
        ("pip install -r requirements.txt", "Installing Python dependencies", "backend"),
        ("npm install", "Installing frontend dependencies", "frontend"),
        ("npm run build", "Building frontend React app", "frontend"),
        ("python manage.py collectstatic --noinput", "Collecting static files", "backend"),
    ]
    
    all_steps_ok = True
    for cmd, description, cwd in build_steps:
        if not run_command(cmd, description, cwd=cwd if cwd != "." else None):
            all_steps_ok = False
            break
    
    if not all_steps_ok:
        print(f"\n{Colors.RED}Build failed! Fix the errors above before deploying to Render.{Colors.END}")
        sys.exit(1)
    
    # Verify build output
    print(f"\n{Colors.BLUE}=== Verifying Build Output ==={Colors.END}")
    
    if os.path.exists('frontend/dist'):
        print_success("Frontend dist directory created")
        if len(os.listdir('frontend/dist')) > 0:
            print_success(f"Frontend dist has {len(os.listdir('frontend/dist'))} items")
        else:
            print_error("Frontend dist directory is empty")
            sys.exit(1)
    else:
        print_error("Frontend dist directory not created")
        sys.exit(1)
    
    if os.path.exists('backend/staticfiles'):
        print_success("Static files collected")
    else:
        print_warning("Static files directory not created (may be normal)")
    
    # Final summary
    print(f"\n{Colors.BLUE}=== Build Verification Summary ==={Colors.END}")
    print_success("All local build steps completed successfully!")
    print(f"\n{Colors.GREEN}✓ Your application is ready to deploy to Render{Colors.END}")
    print(f"\n{Colors.YELLOW}Next Steps:{Colors.END}")
    print("  1. Review RENDER_DEPLOYMENT_CHECKLIST.md")
    print("  2. Ensure all environment variables are set on Render")
    print("  3. Go to https://dashboard.render.com")
    print("  4. Click 'Create Web Service' and connect your GitHub repository")
    print("  5. Monitor deployment in the Render dashboard")

if __name__ == '__main__':
    main()
