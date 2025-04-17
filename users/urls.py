from django.urls import path
from .views import RegisterView, LoginView, UserView, UserDeleteView, UserListView
urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('me/', UserView.as_view(), name='me'),
    path('users/<int:pk>/', UserDeleteView.as_view(), name='user-delete'),
    path('users/', UserListView.as_view(), name='user-list'),
]
