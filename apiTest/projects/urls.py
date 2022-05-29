from django.urls import path
from . import views

urlpatterns = [
    path('create_project/', views.create_project),
    path('project/<int:id>', views.read_project),
    path('update_project/', views.update_project),
    path('delete_project/<int:id>', views.delete_project),
    path('projects/', views.get_all_project),

    path('add_member_project/', views.add_project_member),
    path('project_members/<int:project_id>', views.read_project_member),
    path('delete_project_member/', views.delete_project_member),
]