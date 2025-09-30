from django.contrib import admin
from .models import Warehouse, Item, Stock, StockTransaction


@admin.register(Warehouse)
class WarehouseAdmin(admin.ModelAdmin):
    list_display = ("name", "location")
    search_fields = ("name", "location")


@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_display = ("name", "description")
    search_fields = ("name",)


@admin.register(Stock)
class StockAdmin(admin.ModelAdmin):
    list_display = ("item", "warehouse", "quantity")
    list_filter = ("warehouse",)
    search_fields = ("item__name", "warehouse__name")


@admin.register(StockTransaction)
class StockTransactionAdmin(admin.ModelAdmin):
    list_display = ("item", "warehouse", "transaction_type", "quantity")
    list_filter = ("transaction_type",)
    search_fields = ("item__name", "warehouse__name")
