#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Apply database migrations
python manage.py migrate

# Collect static files (if you use them)
python manage.py collectstatic --noinput

# Start Gunicorn server
gunicorn backend.wsgi:application --bind 0.0.0.0:$PORT
