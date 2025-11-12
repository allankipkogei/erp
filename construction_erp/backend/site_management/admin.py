from django.contrib import admin
from .models import Site, DailyLog, SiteInspection, SafetyRecord


@admin.register(Site)
class SiteAdmin(admin.ModelAdmin):
    list_display = ('name', 'location', 'status', 'start_date', 'end_date', 'workers_count')
    list_filter = ('status', 'start_date')
    search_fields = ('name', 'location', 'project_manager')


@admin.register(DailyLog)
class DailyLogAdmin(admin.ModelAdmin):
    list_display = ('site', 'date')
    list_filter = ('date',)
    search_fields = ('site__name', 'notes')
    date_hierarchy = 'date'


@admin.register(SiteInspection)
class SiteInspectionAdmin(admin.ModelAdmin):
    list_display = ('site', 'date', 'inspector', 'status')
    list_filter = ('status', 'date')
    search_fields = ('site__name', 'inspector')
    date_hierarchy = 'date'


@admin.register(SafetyRecord)
class SafetyRecordAdmin(admin.ModelAdmin):
    list_display = ('site', 'date', 'severity')
    list_filter = ('severity', 'date')
    search_fields = ('site__name', 'description')
    date_hierarchy = 'date'
