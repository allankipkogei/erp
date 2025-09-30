from rest_framework import viewsets
from .models import Project, Task, Milestone, ProjectDocument, ProjectTeam
from .serializers import (
    ProjectSerializer,
    TaskSerializer,
    MilestoneSerializer,
    ProjectDocumentSerializer,
    ProjectTeamSerializer,
)


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all().order_by("-created_at")
    serializer_class = ProjectSerializer


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all().order_by("-due_date")
    serializer_class = TaskSerializer


class MilestoneViewSet(viewsets.ModelViewSet):
    queryset = Milestone.objects.all().order_by("target_date")
    serializer_class = MilestoneSerializer


class DocumentViewSet(viewsets.ModelViewSet):
    queryset = ProjectDocument.objects.all().order_by("-uploaded_at")
    serializer_class = ProjectDocumentSerializer


class ProjectTeamViewSet(viewsets.ModelViewSet):
    queryset = ProjectTeam.objects.all()
    serializer_class = ProjectTeamSerializer
