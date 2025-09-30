from rest_framework import viewsets
from .models import Site, DailyLog, SiteInspection, SafetyRecord
from .serializers import (
    SiteSerializer,
    DailyLogSerializer,
    SiteInspectionSerializer,
    SafetyRecordSerializer,
)


class SiteViewSet(viewsets.ModelViewSet):
    queryset = Site.objects.all()
    serializer_class = SiteSerializer


class DailyLogViewSet(viewsets.ModelViewSet):
    queryset = DailyLog.objects.all()
    serializer_class = DailyLogSerializer


class SiteInspectionViewSet(viewsets.ModelViewSet):
    queryset = SiteInspection.objects.all()
    serializer_class = SiteInspectionSerializer


class SafetyRecordViewSet(viewsets.ModelViewSet):
    queryset = SafetyRecord.objects.all()
    serializer_class = SafetyRecordSerializer
