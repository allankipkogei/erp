from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model
from django.db.models import Q

UserModel = get_user_model()

class EmailBackend(ModelBackend):
    def authenticate(self, request, email=None, password=None, **kwargs):
        if email is None:
            return None

        try:
            # match by email OR username
            user = UserModel.objects.get(
                Q(email__iexact=email) | Q(username__iexact=email)
            )
        except UserModel.DoesNotExist:
            return None

        if user.check_password(password):
            return user
        return None
