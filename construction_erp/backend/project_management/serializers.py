from rest_framework import serializers
from .models import Project, Task, Milestone, ProjectDocument, ProjectTeam
from django.contrib.auth import get_user_model
User = get_user_model()



# ✅ Define UserSerializer first
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'email']


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = "__all__"
        extra_kwargs = {
            'description': {'required': False},
            'start_date': {'required': False},
            'created_by': {'required': False},
        }


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
    member_name = serializers.CharField(source='member.username', read_only=True)
    project_name = serializers.CharField(source='project.name', read_only=True)

    class Meta:
        model = ProjectTeam
        fields = ['id', 'project', 'project_name', 'member', 'member_name', 'role']
