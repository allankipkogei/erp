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
    supplier = serializers.PrimaryKeyRelatedField(
        queryset=Supplier.objects.all(),
        required=False,
        allow_null=True,
    )
    order_date = serializers.DateField(required=False, allow_null=True)
    delivery_date = serializers.DateField(required=False, allow_null=True)

    class Meta:
        model = PurchaseOrder
        fields = "__all__"
        extra_kwargs = {
            "status": {"required": False},
            "notes": {"required": False, "allow_blank": True},
        }
