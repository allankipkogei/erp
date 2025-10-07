from rest_framework import generics
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

# Your existing classes...
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class UserRegistrationView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]

# ADD THIS MISSING CLASS
class UserDetailView(generics.RetrieveUpdateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)

@api_view(['POST'])
def login_view(request):
    email = request.data.get('email')
    password = request.data.get('password')

    print(f"=== LOGIN ATTEMPT DEBUG ===")
    print(f"Email received: {email}")
    print(f"Password received: {password}")
    print(f"All request data: {request.data}")
    
    # First, check if user exists by email
    try:
        user_by_email = CustomUser.objects.get(email=email)
        print(f"✅ User found in database: {user_by_email.username}")
        print(f"📋 User details - Active: {user_by_email.is_active}, Staff: {user_by_email.is_staff}")

        # Test password manually
        password_correct = user_by_email.check_password(password)
        print(f"🔐 Password check result: {password_correct}")
        
        if password_correct:
            user = authenticate(request, username=user_by_email.username, password=password)
            print(f"🔑 Authentication result: {user}")
            
            if user is not None:
                login(request, user)
                serializer = UserSerializer(user)
                return Response({
                    'message': 'Login successful',
                    'user': serializer.data
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'error': 'Authentication failed'
                }, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({
                'error': 'Invalid password'
            }, status=status.HTTP_400_BAD_REQUEST)
            
    except CustomUser.DoesNotExist:
        print(f"❌ No user found with email: {email}")
        return Response({
            'error': 'User with this email does not exist'
        }, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        print(f"💥 Unexpected error: {str(e)}")
        return Response({
            'error': 'An unexpected error occurred'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

    
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_current_user(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)    

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)
    
class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_current_user(request):
    try:
        user = request.user
        serializer = UserSerializer(user)  # Make sure you have this serializer
        return Response(serializer.data)
    except Exception as e:
        print(f"Error in get_current_user: {e}")
        return Response({"error": str(e)}, status=500)    