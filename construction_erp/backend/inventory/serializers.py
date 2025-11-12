from rest_framework import serializers
from .models import Warehouse, InventoryItem, Material, Stock, StockMovement


class WarehouseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Warehouse
        fields = "__all__"


class InventoryItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = InventoryItem
        fields = "__all__"


class MaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Material
        fields = "__all__"


class StockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stock
        fields = "__all__"


class StockMovementSerializer(serializers.ModelSerializer):
    class Meta:
        model = StockMovement
        fields = "__all__"
