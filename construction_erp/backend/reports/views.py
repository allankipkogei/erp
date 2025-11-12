from rest_framework import viewsets, permissions, status
from rest_framework.permissions import AllowAny
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Report, KPI
from .serializers import ReportSerializer, KPISerializer


class ReportViewSet(viewsets.ModelViewSet):
    """
    CRUD operations for Reports
    """
    queryset = Report.objects.all()
    serializer_class = ReportSerializer
    permission_classes = [AllowAny]

    @action(detail=True, methods=['post'])
    def generate(self, request, pk=None):
        """Generate report"""
        report = self.get_object()
        report.status = 'generated'
        report.save()
        return Response({'status': 'report generated'})

    @action(detail=False, methods=['get'])
    def by_type(self, request):
        """Get reports by type"""
        report_type = request.query_params.get('type')
        if report_type:
            reports = Report.objects.filter(report_type=report_type)
            serializer = self.get_serializer(reports, many=True)
            return Response(serializer.data)
        return Response({'error': 'type parameter required'}, status=400)

    @action(detail=False, methods=['get'])
    def recent(self, request):
        """Get recent reports"""
        reports = Report.objects.all().order_by('-created_at')[:10]
        serializer = self.get_serializer(reports, many=True)
        return Response(serializer.data)


class KPIViewSet(viewsets.ModelViewSet):
    queryset = KPI.objects.all().order_by("-calculated_at")
    serializer_class = KPISerializer
    permission_classes = [permissions.IsAuthenticated]
