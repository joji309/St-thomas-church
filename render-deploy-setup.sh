#!/bin/bash

# Render Deployment Setup Script for St. Thomas Church Website
# This script prepares the application for deployment on Render

set -e  # Exit on error

echo "=== St. Thomas Church - Render Deployment Setup ==="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print success
success() {
    echo -e "${GREEN}✓ $1${NC}"
}

# Function to print warning
warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Function to print error
error() {
    echo -e "${RED}✗ $1${NC}"
}

echo "This script will guide you through Render deployment setup..."
echo ""

# Check for necessary files
echo "Checking for required files..."

required_files=(
    "render.yaml"
    "Procfile"
    "backend/requirements.txt"
    "frontend/package.json"
    "backend/server/settings.py"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        success "Found: $file"
    else
        error "Missing: $file"
        exit 1
    fi
done

echo ""
echo "All required files present!"
echo ""

# Check for database setup
echo "Checking database migrations..."
if [ -d "backend/migrations" ]; then
    success "Migrations directory found"
else
    warning "No migrations directory found - migrations will be created on first run"
fi

echo ""
echo "=== Environment Variables Needed on Render ==="
echo ""
echo "Please set these environment variables in your Render dashboard:"
echo ""
cat << 'EOF'
Core Settings:
  DEBUG                  = False
  SECRET_KEY             = (generate a random key - see instructions below)
  ALLOWED_HOSTS          = your-render-url.onrender.com

Database (if using PostgreSQL/Neon):
  DB_ENGINE              = django.db.backends.postgresql
  DB_NAME                = neondb
  DB_USER                = neondb_owner
  DB_PASSWORD            = (your Neon password)
  DB_HOST                = (your Neon host)
  DB_PORT                = 5432

CORS Settings:
  CORS_ALLOWED_ORIGINS   = https://your-render-url.onrender.com

EOF

echo ""
echo "To generate a SECRET_KEY, run:"
echo "  python -c \"from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())\""
echo ""

# Check Python version
echo "Checking Python version..."
python_version=$(python --version 2>&1 | awk '{print $2}')
success "Python version: $python_version"

echo ""
echo "=== Build Process Summary ==="
echo ""
echo "Render will execute these commands in order:"
echo ""
echo "1. Build Command:"
echo "   - Install Python dependencies (requirements.txt)"
echo "   - Install Node dependencies (npm install)"
echo "   - Build frontend React app (npm run build)"
echo "   - Collect static files"
echo ""
echo "2. Release Command:"
echo "   - Run database migrations"
echo ""
echo "3. Start Command:"
echo "   - Start Gunicorn server"
echo ""

echo ""
echo "=== Deployment Checklist ==="
echo ""
echo "Before deploying to Render, ensure:"
echo ""
echo "☐ GitHub repository is public (or give Render access to private repo)"
echo "☐ All changes are committed and pushed to 'main' branch"
echo "☐ render.yaml is configured correctly"
echo "☐ Procfile has correct commands"
echo "☐ requirements.txt has all Python dependencies"
echo "☐ frontend/package.json has all Node dependencies"
echo "☐.env file is NOT committed (add to .gitignore)"
echo "☐ Database is ready (if using PostgreSQL)"
echo ""

echo ""
echo "=== Next Steps ==="
echo ""
echo "1. Go to https://dashboard.render.com"
echo "2. Click 'New +' → 'Web Service'"
echo "3. Connect your GitHub repository: joji309/St-thomas-church"
echo "4. Configure the service with these settings:"
echo "   - Name: st-thomas-church"
echo "   - Environment: Python 3"
echo "   - Region: Ohio (us-east) or your preferred region"
echo "   - Branch: main"
echo "5. Set all environment variables (see above)"
echo "6. Click 'Create Web Service'"
echo ""

echo ""
success "Setup verification complete!"
echo ""
echo "Your application is ready for deployment on Render."
echo ""
