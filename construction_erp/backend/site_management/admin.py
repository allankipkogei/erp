from django.contrib import admin
from .models import Site, DailyLog, SiteInspection, SafetyRecord


@admin.register(Site)
class SiteAdmin(admin.ModelAdmin):
    list_display = ('location', 'project')
    list_filter = ('project',)
    search_fields = ('location',)


@admin.register(DailyLog)
class DailyLogAdmin(admin.ModelAdmin):
    list_display = ('site', 'date')
    list_filter = ('date', 'site')
    date_hierarchy = 'date'


@admin.register(SiteInspection)
class SiteInspectionAdmin(admin.ModelAdmin):
    list_display = ('site', 'inspector', 'status')
    list_filter = ('status',)


@admin.register(SafetyRecord)
class SafetyRecordAdmin(admin.ModelAdmin):
    list_display = ('site', 'severity', 'reported_by')
    list_filter = ('severity',)
