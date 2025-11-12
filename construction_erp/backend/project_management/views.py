from rest_framework import generics, viewsets, permissions, decorators, response, status
from django.contrib.auth import get_user_model
from rest_framework.permissions import AllowAny
from .models import Project, Task, Milestone, ProjectDocument, ProjectTeam
from .serializers import (
    ProjectSerializer,
    TaskSerializer,
    MilestoneSerializer,
    ProjectDocumentSerializer,
    ProjectTeamSerializer,
    UserSerializer,
)
from rest_framework.decorators import api_view
from rest_framework.response import Response
from accounts.models import CustomUser
from accounts.serializers import UserSerializer
from rest_framework import serializers  # ADD THIS IMPORT

User = get_user_model()


# ------------------------------
# 🔹 Project Management ViewSets
# ------------------------------
class ProjectViewSet(viewsets.ModelViewSet):
    """
    CRUD operations for Projects
    """
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [AllowAny]
    
    def create(self, request, *args, **kwargs):
        """Override create to add better error handling"""
        print(f"Project create data: {request.data}")  # Debug log
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        except serializers.ValidationError as e:
            print(f"Validation error: {e.detail}")  # Debug log
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
    
    @decorators.action(detail=True, methods=['get'])
    def tasks(self, request, pk=None):
        """Get all tasks for a project"""
        project = self.get_object()
        tasks = project.tasks.all()
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)
    
    @decorators.action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """Mark project as completed"""
        project = self.get_object()
        project.status = 'completed'
        project.save()
        return Response({'status': 'project marked as completed'})

class TaskViewSet(viewsets.ModelViewSet):
    """
    CRUD operations for Tasks
    """
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [AllowAny]
    
    def create(self, request, *args, **kwargs):
        """Override create to add better error handling"""
        print(f"Task create data: {request.data}")  # Debug log
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        except serializers.ValidationError as e:
            print(f"Validation error: {e.detail}")  # Debug log
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
    
    @decorators.action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """Mark task as completed"""
        task = self.get_object()
        task.status = 'completed'
        task.save()
        return Response({'status': 'task completed'})
    
    @decorators.action(detail=False, methods=['get'])
    def my_tasks(self, request):
        """Get tasks assigned to current user"""
        tasks = Task.objects.filter(assigned_to=request.user)
        serializer = self.get_serializer(tasks, many=True)
        return Response(serializer.data)

class MilestoneViewSet(viewsets.ModelViewSet):
    """
    CRUD operations for Milestones
    """
    queryset = Milestone.objects.all()
    serializer_class = MilestoneSerializer
    permission_classes = [AllowAny]

class ProjectDocumentViewSet(viewsets.ModelViewSet):
    """
    CRUD operations for Project Documents
    """
    queryset = ProjectDocument.objects.all()
    serializer_class = ProjectDocumentSerializer
    permission_classes = [AllowAny]

class ProjectTeamViewSet(viewsets.ModelViewSet):
    """
    CRUD operations for Project Team
    """
    queryset = ProjectTeam.objects.all()
    serializer_class = ProjectTeamSerializer
    permission_classes = [AllowAny]

class UserViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Read-only operations for Users
    """
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

# ------------------------------
# 🔹 Simple List API View for Users
# ------------------------------
@api_view(['GET'])
def UserListView(request):
    """Get all users"""
    users = CustomUser.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)
