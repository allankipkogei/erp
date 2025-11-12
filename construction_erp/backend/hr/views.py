from rest_framework import viewsets, status
from rest_framework.permissions import AllowAny
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .models import Employee, Attendance, Payroll, Leave
from .serializers import (
    EmployeeSerializer,
    AttendanceSerializer,
    PayrollSerializer,
    LeaveSerializer,
)

class EmployeeViewSet(viewsets.ModelViewSet):
    """
    CRUD operations for Employees
    """
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    permission_classes = [AllowAny]
    
    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        """Activate employee"""
        employee = self.get_object()
        employee.is_active = True
        employee.save()
        return Response({'status': 'employee activated'})
    
    @action(detail=True, methods=['post'])
    def deactivate(self, request, pk=None):
        """Deactivate employee"""
        employee = self.get_object()
        employee.is_active = False
        employee.save()
        return Response({'status': 'employee deactivated'})

class AttendanceViewSet(viewsets.ModelViewSet):
    """
    CRUD operations for Attendance
    """
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer
    permission_classes = [AllowAny]
    
    def create(self, request, *args, **kwargs):
        """Create attendance record without requiring employee"""
        data = request.data.copy()
        
        # If employee is not provided, create attendance without employee
        if 'employee' not in data or not data['employee']:
            data['employee'] = None
        
        # Set default date if not provided
        if 'date' not in data:
            data['date'] = timezone.now().date()
        
        # Set default check_in if not provided
        if 'check_in' not in data:
            data['check_in'] = timezone.now()
        
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
    @action(detail=False, methods=['post'])
    def mark_present(self, request):
        """Mark attendance as present"""
        today = timezone.now().date()
        
        # Create attendance record
        attendance = Attendance.objects.create(
            date=today,
            status='present',
            check_in=timezone.now(),
            check_out=timezone.now()
        )
        
        serializer = self.get_serializer(attendance)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['post'])
    def mark_absent(self, request):
        """Mark attendance as absent"""
        today = timezone.now().date()
        
        # Create attendance record
        attendance = Attendance.objects.create(
            date=today,
            status='absent',
            check_in=timezone.now()
        )
        
        serializer = self.get_serializer(attendance)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class PayrollViewSet(viewsets.ModelViewSet):
    """
    CRUD operations for Payroll
    """
    queryset = Payroll.objects.all()
    serializer_class = PayrollSerializer
    permission_classes = [AllowAny]
    
    @action(detail=True, methods=['post'])
    def process(self, request, pk=None):
        """Process payroll"""
        payroll = self.get_object()
        payroll.status = 'processed'
        payroll.save()
        return Response({'status': 'payroll processed'})

class LeaveViewSet(viewsets.ModelViewSet):
    """
    CRUD operations for Leave
    """
    queryset = Leave.objects.all()
    serializer_class = LeaveSerializer
    permission_classes = [AllowAny]
    
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Approve leave request"""
        leave = self.get_object()
        leave.status = 'approved'
        leave.save()
        return Response({'status': 'leave approved'})
    
    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        """Reject leave request"""
        leave = self.get_object()
        leave.status = 'rejected'
        leave.save()
        return Response({'status': 'leave rejected'})
