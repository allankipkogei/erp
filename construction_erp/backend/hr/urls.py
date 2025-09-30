from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet,
    DepartmentViewSet,
    RoleViewSet,
    EmployeeViewSet,
    AttendanceViewSet,
    PayrollViewSet
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'departments', DepartmentViewSet)
router.register(r'roles', RoleViewSet)
router.register(r'employees', EmployeeViewSet)
router.register(r'attendance', AttendanceViewSet)
router.register(r'payrolls', PayrollViewSet)

urlpatterns = router.urls
