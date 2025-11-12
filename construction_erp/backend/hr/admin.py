from django.contrib import admin
from .models import Employee, Attendance, Payroll, Leave


@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ('id', 'department', 'hire_date')
    list_filter = ('department', 'hire_date')
    search_fields = ('id',)


@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = ('employee', 'date', 'status')
    list_filter = ('status', 'date')
    date_hierarchy = 'date'


@admin.register(Payroll)
class PayrollAdmin(admin.ModelAdmin):
    list_display = ('employee', 'net_salary')
    list_filter = ('employee',)


@admin.register(Leave)
class LeaveAdmin(admin.ModelAdmin):
    list_display = ('employee', 'leave_type', 'start_date', 'end_date', 'status')
    list_filter = ('leave_type', 'status')
