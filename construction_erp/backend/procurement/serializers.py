from rest_framework import serializers
from .models import Supplier, PurchaseRequest, PurchaseOrder, PurchaseOrderItem


class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = "__all__"


class PurchaseRequestSerializer(serializers.ModelSerializer):
    requester = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = PurchaseRequest
        fields = "__all__"


class PurchaseOrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PurchaseOrderItem
        fields = "__all__"


class PurchaseOrderSerializer(serializers.ModelSerializer):
    supplier = SupplierSerializer(read_only=True)
    supplier_id = serializers.PrimaryKeyRelatedField(
        queryset=Supplier.objects.all(), source="supplier", write_only=True
    )
    items = PurchaseOrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = PurchaseOrder
        fields = ["id", "supplier", "supplier_id", "created_by", "order_date", "expected_delivery", "status", "items"]
