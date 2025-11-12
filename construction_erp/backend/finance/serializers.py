from rest_framework import serializers
from .models import Invoice, Expense, Payment, Budget


class InvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invoice
        fields = "__all__"


class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = "__all__"


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = "__all__"


class BudgetSerializer(serializers.ModelSerializer):
    remaining_budget = serializers.DecimalField(
         max_digits=12, decimal_places=2, read_only=True
    )

    class Meta:
        model = Budget
        fields = "__all__"
