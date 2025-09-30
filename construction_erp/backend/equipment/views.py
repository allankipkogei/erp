from rest_framework import viewsets
from .models import Equipment, EquipmentAssignment, MaintenanceRecord, EquipmentUsageLog
from .serializers import (
    EquipmentSerializer,
    EquipmentAssignmentSerializer,
    MaintenanceRecordSerializer,
    EquipmentUsageLogSerializer,
)


class EquipmentViewSet(viewsets.ModelViewSet):
    queryset = Equipment.objects.all()
    serializer_class = EquipmentSerializer


class EquipmentAssignmentViewSet(viewsets.ModelViewSet):
    queryset = EquipmentAssignment.objects.all()
    serializer_class = EquipmentAssignmentSerializer


class EquipmentMaintenanceViewSet(viewsets.ModelViewSet):
    queryset = MaintenanceRecord.objects.all()
    serializer_class = MaintenanceRecordSerializer


class EquipmentUsageLogViewSet(viewsets.ModelViewSet):
    queryset = EquipmentUsageLog.objects.all()
    serializer_class = EquipmentUsageLogSerializer
