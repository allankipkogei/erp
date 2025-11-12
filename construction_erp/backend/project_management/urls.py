from django.urls import path, include
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

urlpatterns = [
    path("", include(router.urls)),
    path("project-team/", include(router.urls)),  # optional alias
]