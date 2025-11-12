from rest_framework import serializers
from .models import Equipment, EquipmentAssignment, MaintenanceRecord, EquipmentUsageLog, EquipmentMaintenance


class EquipmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Equipment
        fields = "__all__"


class EquipmentAssignmentSerializer(serializers.ModelSerializer):
    equipment_name = serializers.ReadOnlyField(source="equipment.name")
    project_name = serializers.ReadOnlyField(source="project.name")
    assigned_to_username = serializers.ReadOnlyField(source="assigned_to.username")

    class Meta:
        model = EquipmentAssignment
        fields = "__all__"


class MaintenanceRecordSerializer(serializers.ModelSerializer):
    equipment_name = serializers.ReadOnlyField(source="equipment.name")

    class Meta:
        model = MaintenanceRecord
        fields = "__all__"


class EquipmentUsageLogSerializer(serializers.ModelSerializer):
    equipment_name = serializers.ReadOnlyField(source="equipment.name")
    user_username = serializers.ReadOnlyField(source="user.username")
    project_name = serializers.ReadOnlyField(source="project.name")

    class Meta:
        model = EquipmentUsageLog
        fields = "__all__"


class EquipmentMaintenanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = EquipmentMaintenance
        fields = "__all__"
