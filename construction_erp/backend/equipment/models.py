from django.db import models
from django.conf import settings
from project_management.models import Project


class Equipment(models.Model):
    EQUIPMENT_STATUS = (
        ("available", "Available"),
        ("in_use", "In Use"),
        ("maintenance", "Under Maintenance"),
        ("retired", "Retired"),
    )

    name = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    category = models.CharField(max_length=100)
    purchase_date = models.DateField()
    cost = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=50, choices=EQUIPMENT_STATUS, default="available")

    def __str__(self):
        return self.name


class EquipmentAssignment(models.Model):
    equipment = models.ForeignKey(Equipment, on_delete=models.CASCADE, related_name="assignments")
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="equipment_assignments")
    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="equipment_assignments"
    )
    assigned_date = models.DateField(auto_now_add=True)
    return_date = models.DateField(blank=True, null=True)

    def __str__(self):
        return f"{self.equipment.name} → {self.project.name}"


class MaintenanceRecord(models.Model):
    equipment = models.ForeignKey(Equipment, on_delete=models.CASCADE, related_name="maintenance_records")
    maintenance_date = models.DateField()
    description = models.TextField()
    cost = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    performed_by = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.equipment.name} - {self.maintenance_date}"


class EquipmentUsageLog(models.Model):
    equipment = models.ForeignKey(Equipment, on_delete=models.CASCADE, related_name="usage_logs")
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="equipment_usage_logs"
    )
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="usage_logs")
    start_time = models.DateTimeField()
    end_time = models.DateTimeField(null=True, blank=True)
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.equipment.name} used by {self.user} on {self.project.name}"


class EquipmentMaintenance(models.Model):
    MAINTENANCE_TYPE_CHOICES = [
        ("preventive", "Preventive"),
        ("corrective", "Corrective"),
    ]
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("in_progress", "In Progress"),
        ("completed", "Completed"),
    ]
    
    equipment = models.ForeignKey(Equipment, on_delete=models.CASCADE, related_name="maintenances")
    maintenance_type = models.CharField(max_length=50, choices=MAINTENANCE_TYPE_CHOICES)
    maintenance_date = models.DateField()
    cost = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default="pending")
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.equipment.name} - {self.maintenance_type}"
