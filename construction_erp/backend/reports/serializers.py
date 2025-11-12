from rest_framework import serializers
from .models import Report, KPI


class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = "__all__"


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
