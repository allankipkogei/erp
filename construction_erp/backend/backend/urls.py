from django.contrib import admin
from django.http import JsonResponse
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenRefreshView,
    TokenVerifyView,
)
from accounts.views import CustomTokenObtainPairView
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
    SpectacularRedocView,
)

# Import viewsets from each module
from project_management.views import ProjectViewSet, TaskViewSet, MilestoneViewSet, ProjectDocumentViewSet, ProjectTeamViewSet, UserViewSet, UserListView
from procurement.views import SupplierViewSet, PurchaseOrderViewSet
from inventory.views import (
    WarehouseViewSet, 
    InventoryItemViewSet,  # For all items
    MaterialViewSet,       # For materials only
    StockViewSet, 
    StockMovementViewSet
)
from finance.views import InvoiceViewSet, ExpenseViewSet, PaymentViewSet, BudgetViewSet
from hr.views import EmployeeViewSet, AttendanceViewSet, PayrollViewSet, LeaveViewSet
from equipment.views import EquipmentViewSet, EquipmentAssignmentViewSet, EquipmentMaintenanceViewSet
from site_management.views import SiteViewSet, DailyLogViewSet, SiteInspectionViewSet, SafetyRecordViewSet
from reports.views import ReportViewSet

# Import Materials viewset - ADD THIS
from inventory.views import MaterialViewSet  # or wherever your MaterialViewSet is located

# Setup DRF router
router = DefaultRouter()

# Project Management
router.register(r"projects", ProjectViewSet, basename="projects")
router.register(r"tasks", TaskViewSet, basename="tasks")
router.register(r"milestones", MilestoneViewSet, basename="milestones")
router.register(r"documents", ProjectDocumentViewSet, basename="documents")
router.register(r'project-team', ProjectTeamViewSet)
router.register(r'users', UserViewSet, basename='users')

# Procurement
router.register(r"suppliers", SupplierViewSet, basename="suppliers")
router.register(r"purchase-orders", PurchaseOrderViewSet, basename="purchase_orders")

# Inventory - ADD MATERIALS HERE
router.register(r"inventory-items", MaterialViewSet, basename="inventory_items")
router.register(r"stock-movements", StockMovementViewSet, basename="stock_movements")
router.register(r"materials", MaterialViewSet, basename="materials")  # ADD THIS LINE
router.register(r"warehouses", WarehouseViewSet, basename="warehouses")
router.register(r"stocks", StockViewSet, basename="stocks")

# Finance
router.register(r"invoices", InvoiceViewSet, basename="invoices")
router.register(r"expenses", ExpenseViewSet, basename="expenses")
router.register(r"payments", PaymentViewSet, basename="payments")
router.register(r"budgets", BudgetViewSet, basename="budgets")

# Human Resources
router.register(r"employees", EmployeeViewSet, basename="employees")
router.register(r"attendance", AttendanceViewSet, basename="attendance")
router.register(r"payroll", PayrollViewSet, basename="payroll")
router.register(r"leaves", LeaveViewSet, basename="leaves")

# Equipment
router.register(r"equipment", EquipmentViewSet, basename="equipment")
router.register(r"equipment-assignments", EquipmentAssignmentViewSet, basename="equipment_assignments")
router.register(r"equipment-maintenance", EquipmentMaintenanceViewSet, basename="equipment_maintenance")

# Site Management
router.register(r"sites", SiteViewSet, basename="sites")
router.register(r"daily-logs", DailyLogViewSet, basename="daily_logs")
router.register(r"site-inspections", SiteInspectionViewSet, basename="site_inspections")
router.register(r"safety-records", SafetyRecordViewSet, basename="safety_records")

# Reports
router.register(r"reports", ReportViewSet, basename="reports")

# API root view
def api_root(request):
    return JsonResponse({
        "message": "Welcome to Construction Enterprise Resource Planning API",
        "endpoints": {
            "admin": "/admin/",
            "api_docs": "/api/",
            "token_obtain": "/api/token/",
            "token_refresh": "/api/token/refresh/",
            "token_verify": "/api/token/verify/",
            "projects": "/api/projects/",
            "tasks": "/api/tasks/",
            "milestones": "/api/milestones/",
            "documents": "/api/documents/",
            "suppliers": "/api/suppliers/",
            "purchase_orders": "/api/purchase-orders/",
            "inventory_items": "/api/inventory-items/",
            "stock_movements": "/api/stock-movements/",
            "materials": "/api/materials/",  # ADD THIS LINE
            "invoices": "/api/invoices/",
            "expenses": "/api/expenses/",
            "payments": "/api/payments/",
            "budgets": "/api/budgets/",
            "employees": "/api/employees/",
            "attendance": "/api/attendance/",
            "payroll": "/api/payroll/",
            "leaves": "/api/leaves/",
            "equipment": "/api/equipment/",
            "equipment_assignments": "/api/equipment-assignments/",
            "equipment_maintenance": "/api/equipment-maintenance/",
            "sites": "/api/sites/",
            "daily_logs": "/api/daily-logs/",
            "site_inspections": "/api/site-inspections/",
            "safety_records": "/api/safety-records/",
            "reports": "/api/reports/"
        }
    })

urlpatterns = [
    path("", api_root, name="api-root"),
    path("admin/", admin.site.urls),
    
    # API routes
    path("api/", include(router.urls)),

    # JWT Authentication
    path("api/accounts/token/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair_alt"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/token/verify/", TokenVerifyView.as_view(), name="token_verify"),
    
    # API schema + docs
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/swagger/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
    path("api/docs/redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"),
    
    # Accounts
    path("api/accounts/", include("accounts.urls")),
]