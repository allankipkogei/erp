from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate
from .models import CustomUser


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    email = serializers.CharField(write_only=True)  # email or username
    password = serializers.CharField(write_only=True, style={"input_type": "password"})

    def validate(self, attrs):
        email_or_username = attrs.get("email")
        password = attrs.get("password")

        if not email_or_username or not password:
            raise serializers.ValidationError("Must include 'email' and 'password'.")

        user = authenticate(
            request=self.context.get("request"),
            email=email_or_username,  # ✅ backend checks both email + username
            password=password,
        )

        if not user:
            raise serializers.ValidationError("Invalid email/username or password.")

        attrs["username"] = user.get_username()  # required by SimpleJWT
        data = super().validate(attrs)
        return data


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ["username", "email", "password", "role"]

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data["username"],
            email=validated_data.get("email", ""),
            password=validated_data["password"],
            role=validated_data.get("role", "worker"),
        )
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [
            "id",
            "username",
            "email",
            "role",
            "first_name",
            "last_name",
            "date_joined",
        ]
        read_only_fields = ["id", "date_joined"]
