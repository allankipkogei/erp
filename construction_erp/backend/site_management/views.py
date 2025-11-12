from rest_framework import viewsets, status
from rest_framework import serializers  # ADD THIS IMPORT
from rest_framework.permissions import AllowAny
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Site, DailyLog, SiteInspection, SafetyRecord
from .serializers import (
    SiteSerializer,
    DailyLogSerializer,
    SiteInspectionSerializer,
    SafetyRecordSerializer,
)

class SiteViewSet(viewsets.ModelViewSet):
    """
    CRUD operations for Sites
    """
    queryset = Site.objects.all()
    serializer_class = SiteSerializer
    permission_classes = [AllowAny]
    
    def create(self, request, *args, **kwargs):
        """Override create to add better error handling"""
        print(f"Site create data: {request.data}")
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        except serializers.ValidationError as e:
            print(f"Validation error: {e.detail}")
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        """Activate site"""
        site = self.get_object()
        site.status = 'active'
        site.save()
        return Response({'status': 'site activated'})
    
    @action(detail=True, methods=['get'])
    def daily_logs(self, request, pk=None):
        """Get all daily logs for a site"""
        site = self.get_object()
        logs = site.daily_logs.all()
        serializer = DailyLogSerializer(logs, many=True)
        return Response(serializer.data)

class DailyLogViewSet(viewsets.ModelViewSet):
    """
    CRUD operations for Daily Logs
    """
    queryset = DailyLog.objects.all()
    serializer_class = DailyLogSerializer
    permission_classes = [AllowAny]
    
    def create(self, request, *args, **kwargs):
        """Override create to add better error handling"""
        print(f"DailyLog create data: {request.data}")
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        except serializers.ValidationError as e:
            print(f"Validation error: {e.detail}")
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def today(self, request):
        """Get today's logs"""
        from django.utils import timezone
        today = timezone.now().date()
        logs = DailyLog.objects.filter(date=today)
        serializer = self.get_serializer(logs, many=True)
        return Response(serializer.data)

class SiteInspectionViewSet(viewsets.ModelViewSet):
    """
    CRUD operations for Site Inspections
    """
    queryset = SiteInspection.objects.all()
    serializer_class = SiteInspectionSerializer
    permission_classes = [AllowAny]
    
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Approve inspection"""
        inspection = self.get_object()
        inspection.status = 'passed'
        inspection.save()
        return Response({'status': 'inspection approved'})

class SafetyRecordViewSet(viewsets.ModelViewSet):
    """
    CRUD operations for Safety Records
    """
    queryset = SafetyRecord.objects.all()
    serializer_class = SafetyRecordSerializer
    permission_classes = [AllowAny]
    
    def create(self, request, *args, **kwargs):
        """Override create to add better error handling"""
        print(f"SafetyRecord create data: {request.data}")
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        except serializers.ValidationError as e:
            print(f"Validation error: {e.detail}")
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def critical(self, request):
        """Get critical severity records"""
        records = SafetyRecord.objects.filter(severity='critical')
        serializer = self.get_serializer(records, many=True)
        return Response(serializer.data)
