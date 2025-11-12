from django.contrib import admin
from .models import Warehouse, InventoryItem, Material, Stock, StockMovement


@admin.register(Warehouse)
class WarehouseAdmin(admin.ModelAdmin):
    list_display = ("name", "location", "capacity", "current_stock")
    list_filter = ("location",)
    search_fields = ("name", "location")


@admin.register(InventoryItem)
class InventoryItemAdmin(admin.ModelAdmin):
    list_display = ("name", "sku", "quantity", "unit_price", "warehouse")
    list_filter = ("warehouse", "created_at")
    search_fields = ("name", "sku", "description")
    readonly_fields = ("created_at", "updated_at")


@admin.register(Material)
class MaterialAdmin(admin.ModelAdmin):
    list_display = ("name", "material_type", "quantity", "unit", "warehouse", "status")
    list_filter = ("material_type", "status", "warehouse")
    search_fields = ("name", "description")
    readonly_fields = ("created_at", "updated_at")


@admin.register(Stock)
class StockAdmin(admin.ModelAdmin):
    list_display = ("item", "warehouse", "quantity", "reorder_level")
    list_filter = ("warehouse",)
    search_fields = ("item__name", "warehouse__name")


@admin.register(StockMovement)
class StockMovementAdmin(admin.ModelAdmin):
    list_display = ("item", "movement_type", "quantity", "movement_date", "reference")
    list_filter = ("movement_type", "movement_date")
    search_fields = ("item__name", "reference")
    date_hierarchy = "movement_date"
