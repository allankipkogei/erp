from rest_framework.routers import DefaultRouter
from .views import (
    ProjectViewSet,
    TaskViewSet,
    MilestoneViewSet,
    ProjectDocumentViewSet,
    ProjectTeamViewSet,
)

router = DefaultRouter()
router.register("projects", ProjectViewSet)
router.register("tasks", TaskViewSet)
router.register("milestones", MilestoneViewSet)
router.register("documents", ProjectDocumentViewSet)
router.register("teams", ProjectTeamViewSet)

urlpatterns = router.urls
