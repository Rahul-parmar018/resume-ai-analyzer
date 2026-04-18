#!/usr/bin/env bash
# Render Build Script — runs during every deploy

set -o errexit  # Exit on error

pip install -r requirements.txt

# Run Django migrations
python manage.py migrate --noinput

# Collect static files (if any)
python manage.py collectstatic --noinput || true
