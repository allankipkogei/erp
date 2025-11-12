from rest_framework import viewsets, status
from rest_framework.permissions import AllowAny
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Equipment, EquipmentAssignment, EquipmentMaintenance
from .serializers import (
    EquipmentSerializer,
    EquipmentAssignmentSerializer,
    EquipmentMaintenanceSerializer,
)


class EquipmentViewSet(viewsets.ModelViewSet):
    """
    CRUD operations for Equipment
    """
    queryset = Equipment.objects.all()
    serializer_class = EquipmentSerializer
    permission_classes = [AllowAny]
    
    @action(detail=False, methods=['get'])
    def available(self, request):
        """Get all available equipment"""
        equipment = Equipment.objects.filter(status='available')
        serializer = self.get_serializer(equipment, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def mark_maintenance(self, request, pk=None):
        """Mark equipment for maintenance"""
        equipment = self.get_object()
        equipment.status = 'maintenance'
        equipment.save()
        return Response({'status': 'equipment marked for maintenance'})

class EquipmentAssignmentViewSet(viewsets.ModelViewSet):
    """
    CRUD operations for Equipment Assignments
    """
    queryset = EquipmentAssignment.objects.all()
    serializer_class = EquipmentAssignmentSerializer
    permission_classes = [AllowAny]
    
    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """Complete equipment assignment"""
        assignment = self.get_object()
        assignment.status = 'completed'
        assignment.save()
        return Response({'status': 'assignment completed'})

class EquipmentMaintenanceViewSet(viewsets.ModelViewSet):
    """
    CRUD operations for Equipment Maintenance
    """
    queryset = EquipmentMaintenance.objects.all()
    serializer_class = EquipmentMaintenanceSerializer
    permission_classes = [AllowAny]
    
    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """Complete maintenance"""
        maintenance = self.get_object()
        maintenance.status = 'completed'
        maintenance.save()
        return Response({'status': 'maintenance completed'})
