from rest_framework.response import Response
from rest_framework.exceptions import NotFound, PermissionDenied, ValidationError
from rest_framework import generics, serializers, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import UserSerializer, JobSerializer, ApplicationSerializer, RegisterSerializer, ForgotPasswordSerializer, ProfileSerializer, JobSearchSerializer, ApplicationStatusUpdateSerializer
from .models import JobPosting, CustomUser, Applications
from django.db.models import Q


# JOB CREATE AND VIEW
class JobPostingListCreate(generics.ListCreateAPIView):
    serializer_class = JobSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return JobPosting.objects.all().order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Create the job posting
        job = serializer.save(author=request.user)
        
        # Return success response with job data
        return Response({
            'message': 'Job posted successfully',
            'job': JobSerializer(job).data
        }, status=status.HTTP_201_CREATED)


# JOB DETAIL VIEW - Added this new view
class JobPostingDetail(generics.RetrieveAPIView):
    serializer_class = JobSerializer
    permission_classes = [AllowAny]  # Allow anyone to view job details
    queryset = JobPosting.objects.all()


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

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Create the user
        user = serializer.save()
        
        # Return success response with user data
        return Response({
            'message': 'User created successfully',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'role': user.role
            }
        }, status=status.HTTP_201_CREATED)


# User profile info view
class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


#User update info
class UserProfileUpdate(generics.RetrieveUpdateAPIView):
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
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Password reset successful."}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#Search for user profile
class SearchUserProfileView(generics.ListAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        query = self.request.query_params.get('q', '').strip()

        if not query:
            raise NotFound("Search query cannot be empty.")

        # Step 1: Get all users matching username or email
        results = CustomUser.objects.filter(
            Q(username__icontains=query) | Q(email__icontains=query)
        )

        # Step 2: Apply role logic
        user = self.request.user
        if user.role.lower() != 'admin':
            # regular users: exclude admins and themselves
            results = results.filter(role__iexact='user').exclude(id=user.id)

        if not results.exists():
            raise NotFound("User not found.")

        return results


#Application View and create
class ApplicationCreateandView(generics.ListCreateAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Only return the authenticated user's applications
        return Applications.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        user = self.request.user
        job = serializer.validated_data['job']

        # ✅ Check 1: Prevent duplicate applications
        if Applications.objects.filter(user=user, job=job).exists():
            raise serializers.ValidationError("You have already applied to this job.")

        # ✅ Check 2: Prevent applying to own job post
        if job.author == user:  # 'author' must exist in your JobPosting model
            raise serializers.ValidationError("You cannot apply to your own job posting.")

        # ✅ Save the application
        serializer.save(user=user)

#Application view for the job poster
class EmployerApplicationView(generics.ListAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Applications.objects.filter(job__author=self.request.user)
    

class UpdateApplicationStatusView(generics.UpdateAPIView):
    serializer_class = ApplicationStatusUpdateSerializer
    permission_classes = [IsAuthenticated]
    queryset = Applications.objects.all()

    def get_object(self):
        application = super().get_object()

        if application.job.author != self.request.user:
            raise PermissionDenied("You are not allowed to modify this application.")

        return application    


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
    serializer_class = JobSearchSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        query = self.request.query_params.get('q', '')
        return JobPosting.objects.filter(job_title__icontains=query).order_by('-created_at')