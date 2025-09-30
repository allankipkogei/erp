from rest_framework import serializers
from .models import Site, DailyLog, SiteInspection, SafetyRecord


class SiteSerializer(serializers.ModelSerializer):
    project_name = serializers.CharField(source="project.name", read_only=True)
    site_manager_name = serializers.CharField(source="site_manager.username", read_only=True)

    class Meta:
        model = Site
        fields = "__all__"


class DailyLogSerializer(serializers.ModelSerializer):
    site_name = serializers.CharField(source="site.project.name", read_only=True)
    created_by_name = serializers.CharField(source="created_by.username", read_only=True)

    class Meta:
        model = DailyLog
        fields = "__all__"


class SiteInspectionSerializer(serializers.ModelSerializer):
    site_name = serializers.CharField(source="site.project.name", read_only=True)
    inspector_name = serializers.CharField(source="inspector.username", read_only=True)

    class Meta:
        model = SiteInspection
        fields = "__all__"


class SafetyRecordSerializer(serializers.ModelSerializer):
    site_name = serializers.CharField(source="site.project.name", read_only=True)
    reported_by_name = serializers.CharField(source="reported_by.username", read_only=True)

    class Meta:
        model = SafetyRecord
        fields = "__all__"
