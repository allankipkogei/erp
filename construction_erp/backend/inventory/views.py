from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from .models import Warehouse, InventoryItem, Material, Stock, StockMovement
from .serializers import WarehouseSerializer, InventoryItemSerializer, MaterialSerializer, StockSerializer, StockMovementSerializer

class WarehouseViewSet(viewsets.ModelViewSet):
    queryset = Warehouse.objects.all()
    serializer_class = WarehouseSerializer
    permission_classes = [AllowAny]

class InventoryItemViewSet(viewsets.ModelViewSet):
    queryset = InventoryItem.objects.all()
    serializer_class = InventoryItemSerializer
    permission_classes = [AllowAny]

class MaterialViewSet(viewsets.ModelViewSet):
    queryset = Material.objects.all()
    serializer_class = MaterialSerializer
    permission_classes = [AllowAny]

class StockViewSet(viewsets.ModelViewSet):
    queryset = Stock.objects.all()
    serializer_class = StockSerializer
    permission_classes = [AllowAny]

class StockMovementViewSet(viewsets.ModelViewSet):
    queryset = StockMovement.objects.all()
    serializer_class = StockMovementSerializer
    permission_classes = [AllowAny]