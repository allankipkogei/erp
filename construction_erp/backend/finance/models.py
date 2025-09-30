from django.db import models
from django.conf import settings
from project_management.models import Project
from procurement.models import Supplier


class Expense(models.Model):
    CATEGORY_CHOICES = [
        ("materials", "Materials"),
        ("labor", "Labor"),
        ("equipment", "Equipment"),
        ("subcontract", "Subcontract"),
        ("misc", "Miscellaneous"),
    ]

    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="expenses", null=True, blank=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    description = models.TextField()
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    expense_date = models.DateField()
    recorded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.category} - {self.amount}"


class Income(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="incomes", null=True, blank=True)
    description = models.TextField()
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    income_date = models.DateField()
    recorded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Income {self.amount} for {self.project}"


class Invoice(models.Model):
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE, related_name="invoices")
    project = models.ForeignKey(Project, on_delete=models.SET_NULL, null=True, blank=True, related_name="invoices")
    invoice_number = models.CharField(max_length=100, unique=True)
    issue_date = models.DateField()
    due_date = models.DateField()
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(
        max_length=20,
        choices=[("pending", "Pending"), ("paid", "Paid"), ("overdue", "Overdue")],
        default="pending",
    )

    def __str__(self):
        return f"Invoice {self.invoice_number} - {self.supplier.name}"


class Payment(models.Model):
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name="payments")
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    payment_date = models.DateField()
    method = models.CharField(
        max_length=20,
        choices=[("cash", "Cash"), ("bank_transfer", "Bank Transfer"), ("cheque", "Cheque")],
    )
    received_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"Payment {self.amount} for Invoice {self.invoice.invoice_number}"


class Budget(models.Model):
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name="finance_budgets"  # 👈 avoid clash
    )
    total_budget = models.DecimalField(max_digits=12, decimal_places=2)
    spent_budget = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    start_date = models.DateField()
    end_date = models.DateField()
    updated_at = models.DateTimeField(auto_now=True) 

    def remaining_budget(self):
        return self.total_budget - self.spent_budget
    
    @property
    def spent_to_date(self):  # 👈 computed field
        return self.spent_budget

    def __str__(self):
        return f"Budget for {self.project.name}"