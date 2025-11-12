from django.db import models


class Warehouse(models.Model):
    name = models.CharField(max_length=150)
    location = models.CharField(max_length=255, blank=True, null=True)
    capacity = models.PositiveIntegerField(default=0)
    current_stock = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class InventoryItem(models.Model):
    name = models.CharField(max_length=200)
    sku = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    quantity = models.PositiveIntegerField(default=0)
    unit_price = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    warehouse = models.ForeignKey(Warehouse, on_delete=models.CASCADE, related_name="items")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Material(models.Model):
    STATUS_CHOICES = [
        ("available", "Available"),
        ("unavailable", "Unavailable"),
        ("damaged", "Damaged"),
    ]
    name = models.CharField(max_length=200)
    material_type = models.CharField(max_length=100)
    quantity = models.PositiveIntegerField(default=0)
    unit = models.CharField(max_length=50, default="pcs")
    warehouse = models.ForeignKey(Warehouse, on_delete=models.CASCADE, related_name="materials")
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default="available")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Stock(models.Model):
    item = models.ForeignKey(InventoryItem, on_delete=models.CASCADE, related_name="stocks")
    warehouse = models.ForeignKey(Warehouse, on_delete=models.CASCADE, related_name="stock_items")
    quantity = models.PositiveIntegerField(default=0)
    reorder_level = models.PositiveIntegerField(default=10)

    class Meta:
        unique_together = ("item", "warehouse")

    def __str__(self):
        return f"{self.item.name} - {self.warehouse.name} ({self.quantity})"


class StockMovement(models.Model):
    MOVEMENT_TYPES = [
        ("in", "Stock In"),
        ("out", "Stock Out"),
        ("transfer", "Transfer"),
        ("adjustment", "Adjustment"),
    ]
    item = models.ForeignKey(InventoryItem, on_delete=models.CASCADE, related_name="movements")
    movement_type = models.CharField(max_length=20, choices=MOVEMENT_TYPES)
    quantity = models.PositiveIntegerField()
    movement_date = models.DateTimeField(auto_now_add=True)
    reference = models.CharField(max_length=100, blank=True, null=True)
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.movement_type} - {self.item.name} ({self.quantity})"
