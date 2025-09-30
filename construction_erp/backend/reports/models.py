from django.db import models
from django.conf import settings
from project_management.models import Project


class Report(models.Model):
    REPORT_TYPES = [
        ("finance", "Finance"),
        ("procurement", "Procurement"),
        ("inventory", "Inventory"),
        ("hr", "HR"),
        ("equipment", "Equipment"),
        ("site", "Site Management"),
        ("project", "Project Management"),
        ("custom", "Custom"),
    ]

    title = models.CharField(max_length=255)
    report_type = models.CharField(max_length=50, choices=REPORT_TYPES)
    project = models.ForeignKey(Project, on_delete=models.SET_NULL, null=True, blank=True, related_name="reports")
    generated_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    content = models.TextField(help_text="Summary or raw report data")
    file = models.FileField(upload_to="reports/", null=True, blank=True)

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
