from django.contrib import admin
from .models import Expense, Income, Invoice, Payment, Budget


@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ("project", "category", "amount", "expense_date", "recorded_by")
    list_filter = ("category", "expense_date")
    search_fields = ("description", "project__name", "recorded_by__username")


@admin.register(Income)
class IncomeAdmin(admin.ModelAdmin):
    list_display = ("project", "amount", "income_date", "recorded_by")
    list_filter = ("income_date",)
    search_fields = ("description", "project__name")


@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ("invoice_number", "supplier", "project", "amount", "issue_date", "due_date", "status")
    list_filter = ("status", "issue_date", "due_date")
    search_fields = ("invoice_number", "supplier__name", "project__name")


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ("invoice", "amount", "payment_date", "method", "received_by")
    list_filter = ("method", "payment_date")
    search_fields = ("invoice__invoice_number", "received_by__username")


@admin.register(Budget)
class BudgetAdmin(admin.ModelAdmin):
    list_display = ("project", "total_budget", "spent_budget")
    search_fields = ("project__name",)
