from rest_framework import serializers
from .models import Project, Task, Milestone, ProjectDocument, ProjectTeam
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email"]


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = "__all__"


class TaskSerializer(serializers.ModelSerializer):
    assigned_to = UserSerializer(read_only=True)

    class Meta:
        model = Task
        fields = "__all__"


class MilestoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Milestone
        fields = "__all__"


class ProjectDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectDocument
        fields = "__all__"


class ProjectTeamSerializer(serializers.ModelSerializer):
    member = UserSerializer(read_only=True)

    class Meta:
        model = ProjectTeam
        fields = "__all__"
