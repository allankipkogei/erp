from django.db import models
from django.conf import settings
from project_management.models import Project
from django.utils import timezone


class Site(models.Model):
    STATUS_CHOICES = [
        ('planning', 'Planning'),
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('on-hold', 'On Hold'),
    ]

    name = models.CharField(max_length=200)
    location = models.CharField(max_length=255)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='planning')
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    project_manager = models.CharField(max_length=100, blank=True, null=True)
    workers_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class DailyLog(models.Model):
    site = models.ForeignKey(Site, on_delete=models.CASCADE, related_name='daily_logs')
    date = models.DateField()
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date']
        unique_together = ['site', 'date']

    def __str__(self):
        return f"{self.site.name} - {self.date}"


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
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ]
    
    site = models.ForeignKey(Site, on_delete=models.CASCADE, related_name='safety_records')
    date = models.DateField()
    severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES, default='low')
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date']

    def __str__(self):
        return f"{self.site.name} - {self.date} ({self.severity})"
