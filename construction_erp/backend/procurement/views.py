from rest_framework import viewsets, status
from rest_framework import serializers  # added for ValidationError handling
from rest_framework.permissions import AllowAny
from rest_framework.decorators import action  # ADD THIS IMPORT
from rest_framework.response import Response
from django.utils import timezone
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
    
    def create(self, request, *args, **kwargs):
        """Create purchase order with defaults and clear error logging"""
        data = request.data.copy()

        # Ensure supplier is null if not provided
        if 'supplier' not in data or data.get('supplier') in ("", None):
            data['supplier'] = None

        # Set default order_date to today if missing
        if 'order_date' not in data or not data.get('order_date'):
            data['order_date'] = timezone.now().date().isoformat()

        # delivery_date can be omitted -- keep as None if not provided

        # Debug log incoming payload
        print(f"PurchaseOrder create data: {data}")

        serializer = self.get_serializer(data=data)
        try:
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        except serializers.ValidationError as e:
            # Log and return field-level validation errors in response
            print(f"PurchaseOrder validation error: {e.detail}")
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
    
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
