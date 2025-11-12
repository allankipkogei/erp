from rest_framework import viewsets, status
from rest_framework.permissions import AllowAny
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Supplier, PurchaseRequest, PurchaseOrder, PurchaseOrderItem
from .serializers import (
    SupplierSerializer,
    PurchaseRequestSerializer,
    PurchaseOrderSerializer,
    PurchaseOrderItemSerializer,
)
from rest_framework.permissions import IsAuthenticatedOrReadOnly

class SupplierViewSet(viewsets.ModelViewSet):
    """
    CRUD operations for Suppliers
    """
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer
    permission_classes = [AllowAny]
    
    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        """Activate supplier"""
        supplier = self.get_object()
        supplier.is_active = True
        supplier.save()
        return Response({'status': 'supplier activated'})
    
    @action(detail=True, methods=['post'])
    def deactivate(self, request, pk=None):
        """Deactivate supplier"""
        supplier = self.get_object()
        supplier.is_active = False
        supplier.save()
        return Response({'status': 'supplier deactivated'})

class PurchaseRequestViewSet(viewsets.ModelViewSet):
    queryset = PurchaseRequest.objects.all()
    serializer_class = PurchaseRequestSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class PurchaseOrderViewSet(viewsets.ModelViewSet):
    """
    CRUD operations for Purchase Orders
    """
    queryset = PurchaseOrder.objects.all()
    serializer_class = PurchaseOrderSerializer
    permission_classes = [AllowAny]
    
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Approve purchase order"""
        order = self.get_object()
        order.status = 'approved'
        order.save()
        return Response({'status': 'purchase order approved'})
    
    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """Complete purchase order"""
        order = self.get_object()
        order.status = 'completed'
        order.save()
        return Response({'status': 'purchase order completed'})
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancel purchase order"""
        order = self.get_object()
        order.status = 'cancelled'
        order.save()
        return Response({'status': 'purchase order cancelled'})


class PurchaseOrderItemViewSet(viewsets.ModelViewSet):
    queryset = PurchaseOrderItem.objects.all()
    serializer_class = PurchaseOrderItemSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
