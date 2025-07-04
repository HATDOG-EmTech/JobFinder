from django.urls import path
from . import views

urlpatterns = [
    #  Job Posting Views
    path("jobposting/", views.JobPostingListCreate.as_view(), name="job-list"),
    path("jobposting/delete/<int:pk>/", views.JobDelete.as_view(), name="delete-job"),
    path("jobposting/update/<int:pk>/", views.JobUpdate.as_view(), name="update-job"),

    #  User Profile and Auth
    path("user/update/", views.UserProfileUpdate.as_view(), name="update_info"),
    path("user/me/", views.UserProfileView.as_view(), name="view-profile"),
    path("user/forgot-password/", views.ForgotPassword.as_view(), name="forgot-password"),
    # path("user/delete/", views.UserDelete.as_view(), name="delete_user"),
    # path("user/search/", views.SearchUserProfileView.as_view(), name="public-user-profile"),

    #  Job Application (Applicant)
    path("applications/", views.ApplicationCreateandView.as_view(), name="user-applications"),
    path("applications/filter/", views.FilteredApplicationView.as_view(), name="filtered-applications"),
    path("applications/update/<int:pk>/", views.UpdateApplicationStatusView.as_view(), name="update-application-status"),

    #  Job Application (Employer Side)
    path("employer/applications/", views.EmployerApplicationView.as_view(), name="employer-applications"),

    #  Job Search
    path("jobs/search/", views.SearchJobPostingView.as_view(), name="search-jobs"),

    
]

