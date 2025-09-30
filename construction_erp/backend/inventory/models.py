from django.db import models


class Warehouse(models.Model):
    name = models.CharField(max_length=150)
    location = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.name


class Item(models.Model):
    CATEGORY_CHOICES = [
        ("material", "Material"),
        ("equipment", "Equipment"),
        ("consumable", "Consumable"),
    ]
    name = models.CharField(max_length=200)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default="material")
    description = models.TextField(blank=True, null=True)
    unit = models.CharField(max_length=50, default="pcs")  # e.g. kg, liters, pcs
    unit_price = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    def __str__(self):
        return self.name


class Stock(models.Model):
    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name="stocks")
    warehouse = models.ForeignKey(Warehouse, on_delete=models.CASCADE, related_name="stocks")
    quantity = models.PositiveIntegerField(default=0)

    class Meta:
        unique_together = ("item", "warehouse")

    def __str__(self):
        return f"{self.item.name} - {self.warehouse.name} ({self.quantity})"


class StockTransaction(models.Model):
    TRANSACTION_TYPES = [
        ("in", "Stock In"),
        ("out", "Stock Out"),
        ("transfer", "Transfer"),
    ]
    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name="transactions")
    warehouse = models.ForeignKey(Warehouse, on_delete=models.CASCADE, related_name="transactions")
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPES)
    quantity = models.PositiveIntegerField()
    date = models.DateTimeField(auto_now_add=True)
    remarks = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.transaction_type} - {self.item.name} ({self.quantity})"
