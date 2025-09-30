from django.urls import path
from . import views
from .views import UserDetailView, CustomTokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView
from .views import CurrentUserView

urlpatterns = [
    path('register/', views.UserRegistrationView.as_view(), name='register'),
    path('login/', views.login_view, name='login'),  # Make sure this exists
    path('profile/', views.get_user_profile, name='profile'),
    path("token/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("user/", UserDetailView.as_view(), name="user_detail"),  # ✅
    path("users/me/", CurrentUserView.as_view(), name="current-user"),
]