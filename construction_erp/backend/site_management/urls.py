from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'sites', views.SiteViewSet)
router.register(r'daily-logs', views.DailyLogViewSet)
router.register(r'inspections', views.SiteInspectionViewSet)
router.register(r'safety-records', views.SafetyRecordViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
