from rest_framework import viewsets
from .models import Expense, Income, Invoice, Payment, Budget
from .serializers import (
    ExpenseSerializer,
    IncomeSerializer,
    InvoiceSerializer,
    PaymentSerializer,
    BudgetSerializer,
)


class ExpenseViewSet(viewsets.ModelViewSet):
    queryset = Expense.objects.all().order_by("-expense_date")
    serializer_class = ExpenseSerializer


class IncomeViewSet(viewsets.ModelViewSet):
    queryset = Income.objects.all().order_by("-income_date")
    serializer_class = IncomeSerializer


class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoice.objects.all().order_by("-issue_date")
    serializer_class = InvoiceSerializer


class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all().order_by("-payment_date")
    serializer_class = PaymentSerializer


class BudgetViewSet(viewsets.ModelViewSet):
    queryset = Budget.objects.all()
    serializer_class = BudgetSerializer
