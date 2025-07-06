from django.urls import path
from . import views

urlpatterns = [
    # User authentication and profile
    path("user/register/", views.CreateUserView.as_view(), name="register"),
    path("user/me/", views.UserProfileView.as_view(), name="current_user"),
    path("user/update/", views.UserProfileUpdate.as_view(), name="update_user"),
    path("user/forgot-password/", views.ForgotPassword.as_view(), name="forgot_password"),
    path("user/search/", views.SearchUserProfileView.as_view(), name="search_users"),
    
    # Job postings
    path("jobposting/", views.JobPostingListCreate.as_view(), name="jobposting_list_create"),
    path("jobposting/<int:pk>/", views.JobPostingDetail.as_view(), name="job_detail"),
    path("job/create/", views.JobCreateView.as_view(), name="job_create"),
    path("jobposting/update/<int:pk>/", views.JobUpdate.as_view(), name="job_update"),
    path("jobposting/delete/<int:pk>/", views.JobDelete.as_view(), name="job_delete"),
    
    # Applications
    path("applications/", views.ApplicationCreateandView.as_view(), name="applications"),
    path("applications/employer/", views.EmployerApplicationView.as_view(), name="employer_applications"),
    path("applications/filter/", views.FilteredApplicationView.as_view(), name="filtered_applications"),
    path("applications/status/<int:pk>/", views.UpdateApplicationStatusView.as_view(), name="update_application_status"),
]