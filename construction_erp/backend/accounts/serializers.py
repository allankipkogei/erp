from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate
from .models import CustomUser


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True, style={"input_type": "password"})

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        if not email or not password:
            raise serializers.ValidationError("Must include 'email' and 'password'.")

        user = authenticate(
            request=self.context.get("request"),
            email=email,
            password=password,
        )

        if not user:
            raise serializers.ValidationError("Invalid email or password.")

        # Set user for token generation
        attrs["user"] = user
        data = super().validate(attrs)

        # Add role and other info in the response
        data["user"] = {
            "id": user.id,
            "email": user.email,
            "role": user.role,
            "is_staff": user.is_staff,
        }

        return data


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    email = serializers.EmailField(required=True)

    class Meta:
        model = CustomUser
        fields = ["email", "password", "role", "first_name", "last_name"]

    def validate_email(self, value):
        """Validate email is unique"""
        if CustomUser.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value.lower()

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            email=validated_data.get("email", ""),
            password=validated_data["password"],
            role=validated_data.get("role", "worker"),
            first_name=validated_data.get("first_name", ""),
            last_name=validated_data.get("last_name", ""),
        )
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "role",
            "is_active",
            "is_staff",
        ]
