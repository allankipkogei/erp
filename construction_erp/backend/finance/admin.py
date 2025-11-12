from django.contrib import admin
from .models import Invoice, Expense, Payment, Budget


@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ('supplier', 'status')
    search_fields = ('description',)


@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ('description', 'category')
    search_fields = ('description',)


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('invoice', 'payment_date')
    search_fields = ('invoice__invoice_number',)


@admin.register(Budget)
class BudgetAdmin(admin.ModelAdmin):
    list_display = ('project',)
    search_fields = ('project__name',)
