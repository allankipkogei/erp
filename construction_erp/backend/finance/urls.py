from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ExpenseViewSet, IncomeViewSet, InvoiceViewSet, PaymentViewSet, BudgetViewSet

router = DefaultRouter()
router.register(r"expenses", ExpenseViewSet)
router.register(r"incomes", IncomeViewSet)
router.register(r"invoices", InvoiceViewSet)
router.register(r"payments", PaymentViewSet)
router.register(r"budgets", BudgetViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
