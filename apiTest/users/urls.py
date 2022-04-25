from django.urls import path
from . import views
from knox import views as knox_views

urlpatterns = [
    path('clear_users/', views.clear_users),
    path('tokenavailable/', views.is_token_available),
    path('isalive/', views.is_alive),

    path('login/', views.login_api),
    path('logout/', knox_views.LogoutView.as_view()),
    path('logoutall/', knox_views.LogoutAllView.as_view()),
    path('register/', views.create_user),
    path('user/<str:username>', views.read_user),
    path('update_user/', views.update_user),
    path('delete_user/', views.delete_user),
    path('users', views.get_all_users),
    path('projects/<str:username>', views.read_user_projects),

    
    path('create_project/', views.create_project),
    path('project/<int:id>', views.read_project),
    path('update_project/', views.update_project),
    path('delete_project/', views.delete_project),
    path('projects/', views.get_all_project),

    path('create_expense/', views.create_expense),
    path('expense/<int:id>', views.read_expense),
    path('update_expense/', views.update_expense),
    path('delete_expense/', views.delete_expense),
    path('expenses/', views.get_all_expenses),
]