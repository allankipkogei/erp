from rest_framework import serializers
from .models import Report, KPI


class ReportSerializer(serializers.ModelSerializer):
    project_name = serializers.CharField(source="project.name", read_only=True)
    generated_by_username = serializers.CharField(source="generated_by.username", read_only=True)

    class Meta:
        model = Report
        fields = [
            "id",
            "title",
            "report_type",
            "project",
            "project_name",
            "generated_by",
            "generated_by_username",
            "created_at",
            "content",
            "file",
        ]


class KPISerializer(serializers.ModelSerializer):
    project_name = serializers.CharField(source="project.name", read_only=True)

    class Meta:
        model = KPI
        fields = [
            "id",
            "name",
            "description",
            "value",
            "unit",
            "project",
            "project_name",
            "calculated_at",
        ]
