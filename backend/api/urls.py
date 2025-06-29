from django.urls import path
from . import views

urlpatterns = [
    path("jobposting/", views.JobPostingCreate.as_view(), name="job-list"),
    path("jobposting/delete/<int:pk>/", views.JobDelete.as_view(), name="delete-job"),
]
