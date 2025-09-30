from django.db import models
from django.conf import settings


class Project(models.Model):
    STATUS_CHOICES = [
        ("planned", "Planned"),
        ("ongoing", "Ongoing"),
        ("completed", "Completed"),
        ("on_hold", "On Hold"),
        ("cancelled", "Cancelled"),
    ]

    name = models.CharField(max_length=200)
    client = models.CharField(max_length=200, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    start_date = models.DateField()
    end_date = models.DateField(blank=True, null=True)
    budget = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="planned")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Task(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("in_progress", "In Progress"),
        ("completed", "Completed"),
        ("overdue", "Overdue"),
    ]

    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="tasks")
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name="tasks"
    )  # Linked to custom User model
    start_date = models.DateField()
    due_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    progress = models.PositiveIntegerField(default=0, help_text="Completion percentage")

    def __str__(self):
        return f"{self.name} ({self.project.name})"


class Milestone(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="milestones")
    name = models.CharField(max_length=200)
    target_date = models.DateField()
    achieved = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.name} - {self.project.name}"


class ProjectDocument(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="documents")
    name = models.CharField(max_length=200)
    file = models.FileField(upload_to="project_documents/")
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.project.name})"


class ProjectTeam(models.Model):
    ROLE_CHOICES = [
        ("manager", "Manager"),
        ("engineer", "Engineer"),
        ("worker", "Worker"),
        ("consultant", "Consultant"),
    ]

    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="team")
    member = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE,
        related_name="project_memberships"
    )
    role = models.CharField(max_length=50, choices=ROLE_CHOICES, default="worker")

    def __str__(self):
        return f"{self.member.username} - {self.project.name} ({self.role})"
