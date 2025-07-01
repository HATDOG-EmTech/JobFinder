from django.urls import path
from . import views

urlpatterns = [
    path("jobposting/", views.JobCreateView.as_view(), name="job-list"),
    path("jobposting/delete/<int:pk>/", views.JobDelete.as_view(), name="delete-job"),
    path("jobposting/update/<int:pk>", views.JobUpdate.as_view(), name="update-job"),
    path("user/update/", views.UserUpdate.as_view(), name="update_info" ),
]
