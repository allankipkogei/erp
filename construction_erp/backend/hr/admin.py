from django.contrib import admin
from .models import Department, Role, Employee, Attendance, Payroll


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ("name", "description")
    search_fields = ("name",)


@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ("name", "description")
    search_fields = ("name",)


@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ("user", "department", "role", "hire_date", "salary", "is_active")
    list_filter = ("department", "role", "is_active")
    search_fields = ("user__username", "user__first_name", "user__last_name")


@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = ("employee", "date", "check_in", "check_out", "status")
    list_filter = ("status", "date")
    search_fields = ("employee__user__username",)


@admin.register(Payroll)
class PayrollAdmin(admin.ModelAdmin):
    list_display = ("employee", "period_start", "period_end", "basic_salary", "allowances", "deductions", "net_salary")
    list_filter = ("period_start", "period_end")
    search_fields = ("employee__user__username",)
