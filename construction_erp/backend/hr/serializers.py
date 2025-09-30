from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Department, Role, Employee, Attendance, Payroll, Leave


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ["id", "username", "first_name", "last_name", "email"]


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = "__all__"


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = "__all__"


class EmployeeSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Employee
        fields = "__all__"


class AttendanceSerializer(serializers.ModelSerializer):
    employee = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Attendance
        fields = "__all__"


class PayrollSerializer(serializers.ModelSerializer):
    employee = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Payroll
        fields = "__all__"

class LeaveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Leave
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']