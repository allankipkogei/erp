from rest_framework import serializers
from .models import Warehouse, Item, Stock, StockTransaction


class WarehouseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Warehouse
        fields = "__all__"


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = "__all__"


class StockSerializer(serializers.ModelSerializer):
    item = ItemSerializer(read_only=True)
    item_id = serializers.PrimaryKeyRelatedField(
        queryset=Item.objects.all(), source="item", write_only=True
    )
    warehouse = WarehouseSerializer(read_only=True)
    warehouse_id = serializers.PrimaryKeyRelatedField(
        queryset=Warehouse.objects.all(), source="warehouse", write_only=True
    )

    class Meta:
        model = Stock
        fields = ["id", "item", "item_id", "warehouse", "warehouse_id", "quantity"]
        read_only_fields = ["id"]
        

class StockTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = StockTransaction
        fields = "__all__"
