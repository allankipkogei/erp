from rest_framework import serializers
from .models import Employee, Attendance, Payroll, Leave


class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = "__all__"


class AttendanceSerializer(serializers.ModelSerializer):
    employee = serializers.PrimaryKeyRelatedField(
        queryset=Employee.objects.all(),
        required=False,
        allow_null=True
    )
    
    class Meta:
        model = Attendance
        fields = "__all__"


class PayrollSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payroll
        fields = "__all__"


class LeaveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Leave
        fields = "__all__"