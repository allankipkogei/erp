from django.contrib import admin
from .models import Site, DailyLog, SiteInspection, SafetyRecord


@admin.register(Site)
class SiteAdmin(admin.ModelAdmin):
    list_display = ("project", "location", "site_manager", "start_date", "end_date")
    search_fields = ("project__name", "location", "site_manager__username")


@admin.register(DailyLog)
class DailyLogAdmin(admin.ModelAdmin):
    list_display = ("site", "date", "work_done")
    list_filter = ("site", "date")
    search_fields = ("site__project__name", "created_by__username")


@admin.register(SiteInspection)
class SiteInspectionAdmin(admin.ModelAdmin):
    list_display = ("site", "date", "inspector", "remarks")
    list_filter = ("site", "date")
    search_fields = ("site__project__name", "inspector__username")


@admin.register(SafetyRecord)
class SafetyRecordAdmin(admin.ModelAdmin):
    list_display = ("site", "date", "severity", "reported_by")
    list_filter = ("severity", "date")
    search_fields = ("site__project__name", "reported_by__username")
