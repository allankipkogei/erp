from rest_framework import serializers
from .models import Employee, Attendance, Payroll, Leave
from accounts.models import CustomUser  # ADD THIS IMPORT


class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = "__all__"
        extra_kwargs = {
            "user": {"required": False, "allow_null": True},
            "phone": {"required": False, "allow_blank": True},
            "position": {"required": False, "allow_blank": True},
            "department": {"required": False, "allow_blank": True},
            "hire_date": {"required": False, "allow_null": True},
            "salary": {"required": False, "allow_null": True},
        }


class AttendanceSerializer(serializers.ModelSerializer):
    employee = serializers.PrimaryKeyRelatedField(
        queryset=Employee.objects.all(),
        required=False,
        allow_null=True
    )
    user = serializers.PrimaryKeyRelatedField(
        queryset=CustomUser.objects.all(),
        required=False,
        allow_null=True
    )

    class Meta:
        model = Attendance
        fields = '__all__'
        extra_kwargs = {
            'check_in': {'required': False},
            'check_out': {'required': False},
            'notes': {'required': False, 'allow_blank': True},
        }


class PayrollSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payroll
        fields = "__all__"


class LeaveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Leave
        fields = "__all__"