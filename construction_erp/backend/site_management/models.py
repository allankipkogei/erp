from django.db import models
from django.conf import settings
from project_management.models import Project


class Site(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="sites")
    location = models.CharField(max_length=255)
    site_manager = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.project.name} - {self.location}"


class DailyLog(models.Model):
    site = models.ForeignKey(Site, on_delete=models.CASCADE, related_name="daily_logs")
    date = models.DateField()
    work_done = models.TextField()
    issues = models.TextField(blank=True, null=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return f"Log {self.date} - {self.site.project.name}"


class SiteInspection(models.Model):
    STATUS_CHOICES = [
        ("pass", "Pass"),
        ("fail", "Fail"),
    ]

    site = models.ForeignKey(Site, on_delete=models.CASCADE, related_name="inspections")
    date = models.DateField()
    inspector = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    remarks = models.TextField()
    status = models.CharField(max_length=50, choices=STATUS_CHOICES)
    passed = models.BooleanField(default=False)

    def __str__(self):
        return f"Inspection {self.date} - {self.site.project.name}"


class SafetyRecord(models.Model):
    SEVERITY_CHOICES = [
        ("low", "Low"),
        ("medium", "Medium"),
        ("high", "High"),
    ]

    site = models.ForeignKey(Site, on_delete=models.CASCADE, related_name="safety_records")
    date = models.DateField()
    incident = models.TextField()
    severity = models.CharField(max_length=50, choices=SEVERITY_CHOICES)
    reported_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return f"Safety Record {self.date} - {self.site.project.name}"
