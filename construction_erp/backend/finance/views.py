from rest_framework import viewsets, status
from rest_framework import serializers
from rest_framework.permissions import AllowAny
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Invoice, Expense, Payment, Budget
from .serializers import (
    InvoiceSerializer,
    ExpenseSerializer,
    PaymentSerializer,
    BudgetSerializer,
)


class InvoiceViewSet(viewsets.ModelViewSet):
    """
    CRUD operations for Invoices
    """
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer
    permission_classes = [AllowAny]
    
    def create(self, request, *args, **kwargs):
        """Override create to add better error handling"""
        print(f"Invoice create data: {request.data}")  # Debug log
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        except serializers.ValidationError as e:
            print(f"Validation error: {e.detail}")  # Debug log
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def mark_paid(self, request, pk=None):
        """Mark invoice as paid"""
        invoice = self.get_object()
        invoice.status = 'paid'
        invoice.save()
        return Response({'status': 'invoice marked as paid'})
    
    @action(detail=False, methods=['get'])
    def overdue(self, request):
        """Get overdue invoices"""
        from django.utils import timezone
        invoices = Invoice.objects.filter(status='pending', due_date__lt=timezone.now())
        serializer = self.get_serializer(invoices, many=True)
        return Response(serializer.data)


class ExpenseViewSet(viewsets.ModelViewSet):
    """
    CRUD operations for Expenses
    """
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer
    permission_classes = [AllowAny]
    
    @action(detail=False, methods=['get'])
    def by_category(self, request):
        """Get expenses grouped by category"""
        category = request.query_params.get('category')
        if category:
            expenses = Expense.objects.filter(category=category)
            serializer = self.get_serializer(expenses, many=True)
            return Response(serializer.data)
        return Response({'error': 'category parameter required'}, status=400)


class PaymentViewSet(viewsets.ModelViewSet):
    """
    CRUD operations for Payments
    """
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [AllowAny]
    
    @action(detail=True, methods=['post'])
    def confirm(self, request, pk=None):
        """Confirm payment"""
        payment = self.get_object()
        payment.status = 'confirmed'
        payment.save()
        return Response({'status': 'payment confirmed'})

class BudgetViewSet(viewsets.ModelViewSet):
    """
    CRUD operations for Budgets
    """
    queryset = Budget.objects.all()
    serializer_class = BudgetSerializer
    permission_classes = [AllowAny]
    
    @action(detail=True, methods=['get'])
    def utilization(self, request, pk=None):
        """Get budget utilization"""
        budget = self.get_object()
        spent = budget.spent_amount or 0
        allocated = budget.allocated_amount or 0
        utilization = (spent / allocated * 100) if allocated > 0 else 0
        return Response({
            'allocated': allocated,
            'spent': spent,
            'remaining': allocated - spent,
            'utilization_percentage': round(utilization, 2)
        })
