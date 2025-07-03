from django.urls import path
from . import views

urlpatterns = [
    path("jobposting/", views.JobPostingListCreate.as_view(), name="job-list"),
    path("jobposting/delete/<int:pk>/", views.JobDelete.as_view(), name="delete-job"),
    path("jobposting/update/<int:pk>", views.JobUpdate.as_view(), name="update-job"),
    path("user/update/", views.UserUpdate.as_view(), name="update_info" ),
    path('user/profile/', views.UserProfileView.as_view(), name='view-profile'),
    #path("user/delete/", views.UserDelete.as_view(), name="delete_user"),
]
