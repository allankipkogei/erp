from django.contrib import admin
from .models import Equipment, EquipmentAssignment, EquipmentMaintenance


@admin.register(Equipment)
class EquipmentAdmin(admin.ModelAdmin):
    list_display = ("name", "status", "purchase_date")
    list_filter = ("status", "purchase_date")
    search_fields = ("name", "description")


@admin.register(EquipmentAssignment)
class EquipmentAssignmentAdmin(admin.ModelAdmin):
    list_display = ("equipment", "assigned_to", "assigned_date")
    list_filter = ("assigned_date",)
    search_fields = ("equipment__name", "assigned_to__first_name")


@admin.register(EquipmentMaintenance)
class EquipmentMaintenanceAdmin(admin.ModelAdmin):
    list_display = ("equipment", "maintenance_type", "maintenance_date", "cost")
    list_filter = ("maintenance_type", "maintenance_date")
    search_fields = ("equipment__name", "description")
