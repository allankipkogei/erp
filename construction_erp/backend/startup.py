import os
import django
from django.core.management import call_command

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

print("🚀 Starting Construction ERP Backend...")
print("=" * 50)

print("\n🔄 Step 1: Making migrations...")
call_command('makemigrations')

print("\n🔄 Step 2: Applying migrations...")
call_command('migrate')

print("\n✅ Setup complete!")
print("=" * 50)
print("\n📌 Run: python manage.py runserver")
print("📌 Admin: http://localhost:8000/admin/")
print("📌 API Docs: http://localhost:8000/api/docs/swagger/")
