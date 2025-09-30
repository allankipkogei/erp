from rest_framework import viewsets, permissions
from .models import Report, KPI
from .serializers import ReportSerializer, KPISerializer


class ReportViewSet(viewsets.ModelViewSet):
    queryset = Report.objects.all().order_by("-created_at")
    serializer_class = ReportSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(generated_by=self.request.user)


class KPIViewSet(viewsets.ModelViewSet):
    queryset = KPI.objects.all().order_by("-calculated_at")
    serializer_class = KPISerializer
    permission_classes = [permissions.IsAuthenticated]
