from django.contrib import admin
from .models import Report, KPI


@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = ("title", "report_type", "generated_by")
    list_filter = ("report_type",)
    search_fields = ("title", "description")


@admin.register(KPI)
class KPIAdmin(admin.ModelAdmin):
    list_display = ("name", "value", "unit", "project", "calculated_at")
    list_filter = ("unit", "calculated_at")
    search_fields = ("name", "project__name")
