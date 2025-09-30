from django.contrib import admin
from .models import Supplier, PurchaseRequest, PurchaseOrder, PurchaseOrderItem


@admin.register(Supplier)
class SupplierAdmin(admin.ModelAdmin):
    list_display = ("name", "contact_person", "email", "phone", "address")
    search_fields = ("name", "email", "phone")


@admin.register(PurchaseRequest)
class PurchaseRequestAdmin(admin.ModelAdmin):
    list_display = ("id", "requester", "status")
    list_filter = ("status",)
    search_fields = ("requester__username",)


class PurchaseOrderItemInline(admin.TabularInline):
    model = PurchaseOrderItem
    extra = 1


@admin.register(PurchaseOrder)
class PurchaseOrderAdmin(admin.ModelAdmin):
    list_display = ("id", "supplier", "created_by", "order_date", "expected_delivery", "status")
    list_filter = ("status", "order_date")
    search_fields = ("supplier__name", "created_by__username")
    inlines = [PurchaseOrderItemInline]


@admin.register(PurchaseOrderItem)
class PurchaseOrderItemAdmin(admin.ModelAdmin):
    list_display = ("purchase_order", "quantity", "unit_price")
