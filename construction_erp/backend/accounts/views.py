from rest_framework import generics, serializers
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import CustomUser
from .serializers import UserRegistrationSerializer, UserSerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth import authenticate, login
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer
from rest_framework.views import APIView
from .emails import send_welcome_email, send_password_reset_email

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class UserRegistrationView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        if not serializer.validated_data.get("password"):
            raise serializers.ValidationError("Password is required.")
        user = serializer.save()
        
        # Send welcome email
        try:
            send_welcome_email(user)
        except Exception as e:
            # Log the error but don't fail registration
            print(f"Failed to send welcome email: {e}")

class UserDetailView(generics.RetrieveUpdateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)

@api_view(['POST'])
def login_view(request):
    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        return Response({
            'error': 'Email and password are required'
        }, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(request, email=email, password=password)
    
    if user is not None:
        login(request, user)
        serializer = UserSerializer(user)
        return Response({
            'message': 'Login successful',
            'user': serializer.data
        }, status=status.HTTP_200_OK)
    else:
        return Response({
            'error': 'Invalid email or password'
        }, status=status.HTTP_401_UNAUTHORIZED)