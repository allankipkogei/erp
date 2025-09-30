from django.contrib import admin
from .models import Equipment, EquipmentAssignment, MaintenanceRecord, EquipmentUsageLog


@admin.register(Equipment)
class EquipmentAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "status", "purchase_date", "cost")
    list_filter = ("status", "category")
    search_fields = ("name", "category")


@admin.register(EquipmentAssignment)
class EquipmentAssignmentAdmin(admin.ModelAdmin):
    list_display = ("equipment", "project", "assigned_to", "assigned_date", "return_date")
    list_filter = ("project", "assigned_date")
    search_fields = ("equipment__name", "project__name", "assigned_to__username")


@admin.register(MaintenanceRecord)
class MaintenanceRecordAdmin(admin.ModelAdmin):
    list_display = ("equipment", "maintenance_date", "cost", "performed_by")
    list_filter = ("maintenance_date",)
    search_fields = ("equipment__name", "performed_by")


@admin.register(EquipmentUsageLog)
class EquipmentUsageLogAdmin(admin.ModelAdmin):
    list_display = ("equipment", "user", "project", "start_time", "end_time")
    list_filter = ("project", "start_time")
    search_fields = ("equipment__name", "user__username", "project__name")
