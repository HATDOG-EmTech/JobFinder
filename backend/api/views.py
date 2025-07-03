from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import UserSerializer, JobSerializer, ApplicationSerializer, RegisterSerializer, ForgotPasswordSerializer, ProfileSerializer, JobPostingSerializer
from .models import JobPosting, CustomUser, Applications


# JOB CREATE AND VIEW
class JobPostingListCreate(generics.ListCreateAPIView):
    serializer_class = JobSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return JobPosting.objects.all()

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


#JOB POSTING UPDATE API
class JobUpdate(generics.RetrieveUpdateAPIView):
    serializer_class = JobSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return JobPosting.objects.filter(author=self.request.user)

    def perform_update(self, serializer):
        serializer.save(author=self.request.user)


#Job post Create
class JobCreateView(generics.CreateAPIView):
    serializer_class = JobSerializer
    permission_classes = [IsAuthenticated]  # Only authenticated users can access

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

# Job delete view
class JobDelete(generics.DestroyAPIView):
    serializer_class = JobSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.is_superuser:
            # Admins can delete any job posting
            return JobPosting.objects.all()
        # Regular users can only delete their own job postings
        return JobPosting.objects.filter(author=user)

    def perform_destroy(self, instance):
        instance.delete()

# User registration view
class CreateUserView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

# User profile info view
class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


#User update info
class UserUpdate(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

    def perform_update(self, serializer):
        serializer.save()

#User delete information
"""class UserDelete(generics.DestroyAPIView):
    serializer_class = JobSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CustomUser.objects.filter(author=self.request.user)
"""

#Forget Password
class ForgotPassword(generics.GenericAPIView):
    serializer_class = ForgotPasswordSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            self.perform_update(serializer)
        else:
            print(serializer.errors)

    def perform_update(self, serializer):
        serializer.save()


#Application View and create
class ApplicationView(generics.ListCreateAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Applications.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

#Application view for the job poster
class EmployerApplicationView(generics.ListAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Applications.objects.filter(job__author=self.request.user)


#Filter of application
class FilteredApplicationView(generics.ListAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        status = self.request.query_params.get('status')
        queryset = Applications.objects.filter(user=self.request.user)

        if status:
            queryset = queryset.filter(application_status=status)
        return queryset


#Application Status    
class UpdateApplicationStatusView(generics.UpdateAPIView):
    queryset = Applications.objects.all()
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]

    def perform_update(self, serializer):
        application = self.get_object()
        if application.job.author != self.request.user:
            raise PermissionDenied('Not authorized.')

        new_status = self.request.data.get('application_status')
        if new_status not in dict(Applications.STATUS_CHOICES):
            raise ValidationError({'detail': 'Invalid status.'})

        serializer.save(application_status=new_status)    

#Search engine
class SearchJobPostingView(generics.ListAPIView):
    serializer_class = JobPostingSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        query = self.request.query_params.get('q', '')
        return JobPosting.objects.filter(job_title__icontains=query)
    
