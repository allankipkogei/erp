from django.db import models
from django.conf import settings
from project_management.models import Project
from django.utils import timezone


class Report(models.Model):
    REPORT_TYPE_CHOICES = [
        ("financial", "Financial"),
        ("project", "Project"),
        ("safety", "Safety"),
        ("inventory", "Inventory"),
        ("hr", "HR"),
        ("equipment", "Equipment"),
    ]

    title = models.CharField(max_length=200)
    report_type = models.CharField(max_length=50, choices=REPORT_TYPE_CHOICES, default="financial")
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.title} ({self.report_type})"


class KPI(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    value = models.FloatField()
    unit = models.CharField(max_length=50, help_text="e.g., %, Ksh, hours")
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="kpis", null=True, blank=True)
    calculated_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name}: {self.value}{self.unit}"
