from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .serializers import UserSerializer

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_current_user(request):
    print(f"User: {request.user}")
    print(f"User authenticated: {request.user.is_authenticated}")
    print(f"User ID: {request.user.id}")
    
    try:
        user = request.user
        print(f"User object type: {type(user)}")
        
        # Test basic serialization
        from django.contrib.auth import get_user_model
        User = get_user_model()
        test_user = User.objects.get(id=user.id)
        print(f"Test user retrieved: {test_user}")
        
        serializer = UserSerializer(user)
        return Response(serializer.data)
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print(f"Full error: {error_details}")
        return Response({"error": str(e), "details": error_details}, status=500)
