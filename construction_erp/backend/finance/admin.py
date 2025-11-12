from django.contrib import admin
from .models import Invoice, Expense, Payment, Budget


@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ('invoice_number', 'client', 'amount', 'status', 'due_date', 'created_at')
    list_filter = ('status', 'created_at', 'due_date')
    search_fields = ('invoice_number', 'client', 'description')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ('description', 'category', 'amount', 'created_at')
    list_filter = ('category', 'created_at')
    search_fields = ('description', 'category')
    date_hierarchy = 'created_at'
    readonly_fields = ('created_at', 'updated_at')


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('invoice', 'amount', 'payment_date', 'reference')
    list_filter = ('payment_date',)
    search_fields = ('invoice__invoice_number', 'reference')
    date_hierarchy = 'payment_date'
    readonly_fields = ('created_at', 'updated_at')


@admin.register(Budget)
class BudgetAdmin(admin.ModelAdmin):
    list_display = ('project_name', 'allocated_amount', 'spent_amount', 'start_date', 'end_date')
    list_filter = ('start_date', 'end_date')
    search_fields = ('project_name', 'description')
    date_hierarchy = 'start_date'
    readonly_fields = ('created_at', 'updated_at')
