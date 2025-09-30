from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import serializers
from .models import CustomUser

class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = CustomUser.EMAIL_FIELD  # tells JWT to use "email"

    def validate(self, attrs):
        # Rename "email" field to "username" internally for Django auth
        credentials = {
            'email': attrs.get("email"),
            'password': attrs.get("password")
        }
        user = CustomUser.objects.filter(email=credentials["email"]).first()
        if user is None or not user.check_password(credentials["password"]):
            raise serializers.ValidationError("Invalid email or password")

        data = super().validate(attrs)
        data['user'] = {
            "id": self.user.id,
            "username": self.user.username,
            "email": self.user.email,
            "role": self.user.role,
        }
        return data


class EmailTokenObtainPairView(TokenObtainPairView):
    serializer_class = EmailTokenObtainPairSerializer
