import os
from pathlib import Path
from datetime import timedelta
import dj_database_url

BASE_DIR = Path(__file__).resolve().parent.parent

# =========================
# Secrets and debug
# =========================
SECRET_KEY = os.getenv("SECRET_KEY", "fallback-secret-for-local")
DEBUG = os.getenv("DEBUG", "True") == "True"
ALLOWED_HOSTS = os.getenv("ALLOWED_HOSTS", "*").split(",")

# =========================
# Apps and middleware
# =========================
INSTALLED_APPS = [
    # Django default apps...
    "corsheaders",
    "rest_framework",
    "accounts",
    "project_management",
    "procurement",
    "inventory",
    "finance",
    "hr",
    "equipment",
    "site_management",
    "reports",
    "drf_spectacular",
    "rest_framework_simplejwt.token_blacklist",
    'rest_framework.authtoken',
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'core.urls'
WSGI_APPLICATION = 'core.wsgi.application'

# =========================
# Database (PostgreSQL via Railway)
# =========================
DATABASES = {
    "default": dj_database_url.config(
        default='postgres://erp_user:strongpassword@localhost:5432/construction_erp',
        conn_max_age=600,
        ssl_require=True
    )
}

# =========================
# CORS / CSRF
# =========================
CORS_ALLOWED_ORIGINS = os.getenv("CORS_ALLOWED_ORIGINS", "http://localhost:3000").split(",")
CSRF_TRUSTED_ORIGINS = os.getenv("CSRF_TRUSTED_ORIGINS", "http://localhost:3000").split(",")

# =========================
# JWT / REST Framework
# =========================
REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'core.pagination.StandardResultsSetPagination',
    'PAGE_SIZE': 10,
    "DEFAULT_PERMISSION_CLASSES": ["rest_framework.permissions.AllowAny"],
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
        "rest_framework.authentication.SessionAuthentication",
    ],
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
    "DEFAULT_FILTER_BACKENDS": [
        "rest_framework.filters.SearchFilter",
        "rest_framework.filters.OrderingFilter",
    ],
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(hours=1),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
    "AUTH_HEADER_TYPES": ("Bearer",),
}

# =========================
# Static / Media
# =========================
STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# =========================
# Security for production
# =========================
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'
SESSION_COOKIE_SECURE = False
CSRF_COOKIE_SECURE = False
SESSION_COOKIE_HTTPONLY = True
CSRF_COOKIE_HTTPONLY = True

# =========================
# Custom user model
# =========================
AUTH_USER_MODEL = "accounts.CustomUser"
AUTHENTICATION_BACKENDS = [
    'accounts.backends.EmailBackend',
    'django.contrib.auth.backends.ModelBackend',
]
