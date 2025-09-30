from rest_framework.routers import DefaultRouter
from .views import (
    EquipmentViewSet,
    EquipmentAssignmentViewSet,
    MaintenanceRecordViewSet,
    EquipmentUsageLogViewSet,
)

router = DefaultRouter()
router.register(r"equipment", EquipmentViewSet)
router.register(r"assignments", EquipmentAssignmentViewSet)
router.register(r"maintenance", MaintenanceRecordViewSet)
router.register(r"usage-logs", EquipmentUsageLogViewSet)

urlpatterns = router.urls
