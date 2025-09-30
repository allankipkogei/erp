from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Supplier, PurchaseRequest, PurchaseOrder, PurchaseOrderItem
from .serializers import (
    SupplierSerializer,
    PurchaseRequestSerializer,
    PurchaseOrderSerializer,
    PurchaseOrderItemSerializer,
)


class SupplierViewSet(viewsets.ModelViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class PurchaseRequestViewSet(viewsets.ModelViewSet):
    queryset = PurchaseRequest.objects.all()
    serializer_class = PurchaseRequestSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class PurchaseOrderViewSet(viewsets.ModelViewSet):
    queryset = PurchaseOrder.objects.all()
    serializer_class = PurchaseOrderSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class PurchaseOrderItemViewSet(viewsets.ModelViewSet):
    queryset = PurchaseOrderItem.objects.all()
    serializer_class = PurchaseOrderItemSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
