from django.db import models
from django.conf import settings

class Department(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name


class Role(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name


class Employee(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="employee_profile")
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True)
    role = models.ForeignKey(Role, on_delete=models.SET_NULL, null=True, blank=True)
    hire_date = models.DateField()
    salary = models.DecimalField(max_digits=12, decimal_places=2)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.user.get_full_name() or self.user.username


class Attendance(models.Model):
    STATUS_CHOICES = [
        ('present', 'Present'),
        ('absent', 'Absent'),
        ('late', 'Late'),
        ('half_day', 'Half Day'),
    ]
    
    employee = models.ForeignKey(
        Employee, 
        on_delete=models.CASCADE, 
        related_name='attendance_records',
        null=True,
        blank=True
    )
    date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='present')
    check_in = models.DateTimeField(null=True, blank=True)
    check_out = models.DateTimeField(null=True, blank=True)
    notes = models.TextField(blank=True, null=True)

    class Meta:
        ordering = ['-date']

    def __str__(self):
        employee_name = self.employee.get_full_name() if self.employee else "No Employee"
        return f"{employee_name} - {self.date} ({self.status})"


class Payroll(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    period_start = models.DateField()
    period_end = models.DateField()
    basic_salary = models.DecimalField(max_digits=12, decimal_places=2)
    allowances = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    deductions = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    net_salary = models.DecimalField(max_digits=12, decimal_places=2)

    def calculate_net_salary(self):
        return self.basic_salary + self.allowances - self.deductions

    def save(self, *args, **kwargs):
        self.net_salary = self.calculate_net_salary()
        super().save(*args, **kwargs)

class Leave(models.Model):
    LEAVE_TYPES = [
        ('annual', 'Annual Leave'),
        ('sick', 'Sick Leave'),
        ('maternity', 'Maternity Leave'),
        ('paternity', 'Paternity Leave'),
        ('unpaid', 'Unpaid Leave'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    
    employee = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='leaves')
    leave_type = models.CharField(max_length=20, choices=LEAVE_TYPES)
    start_date = models.DateField()
    end_date = models.DateField()
    reason = models.TextField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.employee.username} - {self.leave_type} ({self.status})"

