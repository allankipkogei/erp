from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ReportViewSet, KPIViewSet

router = DefaultRouter()
router.register(r"reports", ReportViewSet)
router.register(r"kpis", KPIViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
