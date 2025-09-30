from django.db import models
from django.conf import settings


class Supplier(models.Model):
    name = models.CharField(max_length=200)
    contact_person = models.CharField(max_length=150, blank=True, null=True)
    phone = models.CharField(max_length=50, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    address = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name


class PurchaseRequest(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
    ]
    requester = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name="purchase_requests")
    item_description = models.TextField()
    quantity = models.PositiveIntegerField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    request_date = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"Request {self.id} - {self.item_description}"


class PurchaseOrder(models.Model):
    STATUS_CHOICES = [
        ("draft", "Draft"),
        ("sent", "Sent to Supplier"),
        ("received", "Received"),
        ("cancelled", "Cancelled"),
    ]
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE, related_name="purchase_orders")
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name="purchase_orders")
    order_date = models.DateField(auto_now_add=True)
    expected_delivery = models.DateField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="draft")

    def __str__(self):
        return f"PO-{self.id} to {self.supplier.name}"


class PurchaseOrderItem(models.Model):
    purchase_order = models.ForeignKey(PurchaseOrder, on_delete=models.CASCADE, related_name="items")
    description = models.CharField(max_length=255)
    quantity = models.PositiveIntegerField()
    unit_price = models.DecimalField(max_digits=12, decimal_places=2)

    def __str__(self):
        return f"{self.description} ({self.quantity})"

