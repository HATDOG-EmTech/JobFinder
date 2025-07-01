from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import UserSerializer, JobSerializer, ApplicationSerializer, RegisterSerializer
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
        # Only allow deletion of posts by the current user
        return JobPosting.objects.filter(author=self.request.user)

    def perform_destroy(self, instance):
        instance.delete()

# User registration view
class CreateUserView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]


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

#Application View
class ApplicationView(generics.ListCreateAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Applications.objects.filter(author=self.request.user)




    