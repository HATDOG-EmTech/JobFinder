from rest_framework import serializers
from .models import JobPosting, Applications, CustomUser

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [
            'username', 'email', 'password', 'first_name', 'last_name',
            'gender', 'mobile', 'location',
            'user_title', 'bio', 'skills',
            'linkedin', 'github', 'role'
        ]
        extra_kwargs = {
            'password': {'write_only': True},
            'role': {'default': 'user'},
            'first_name': {'required': True},
            'last_name': {'required': True}
        }

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            gender=validated_data.get('gender', ''),
            mobile=validated_data.get('mobile', ''),
            location=validated_data.get('location', ''),
            user_title=validated_data.get('user_title', ''),
            bio=validated_data.get('bio', ''),
            skills=validated_data.get('skills', ''),
            linkedin=validated_data.get('linkedin', ''),
            github=validated_data.get('github', ''),
            role=validated_data.get('role', 'user')
        )
        return user

    
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [
            'id', 'username', 'email',
            'first_name', 'last_name', 'gender', 'mobile',
            'location', 'user_title', 'bio', 'skills',
            'linkedin', 'github', 'role'
        ]
        read_only_fields = ['id', 'username', 'email']  # prevent updating these from here


#search profile of other user
class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [
            'username', 'email', 'first_name', 'last_name', 'gender',
            'mobile', 'location', 'user_title', 'bio', 'skills',
            'linkedin', 'github'
        ]
        read_only_fields = fields  # all fields are read-only

#changing passwords
class ForgotPasswordSerializer(serializers.Serializer):
    username = serializers.CharField()
    email = serializers.EmailField()
    new_password = serializers.CharField(write_only=True, min_length=8)

    def validate(self, attrs):
        try:
            user = CustomUser.objects.get(
                username=attrs['username'],
                email=attrs['email']
            )
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError("Username and email do not match.")

        attrs['user'] = user
        return attrs

    def save(self):
        user = self.validated_data['user']
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user

#jobs
class JobSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()
    
    class Meta:
        model = JobPosting
        fields = [
            'id',
            'job_title',
            'job_company',
            'job_location',
            'job_setup',
            'job_type',
            'min_salary',
            'max_salary',
            'job_description',
            'job_requirements',
            'job_benefits',
            'created_at',
            'author',
            'author_name'
        ]
        extra_kwargs = {
            'author': {'read_only': True}
        }
    
    def get_author_name(self, obj):
        if obj.author.first_name and obj.author.last_name:
            return f"{obj.author.first_name} {obj.author.last_name}"
        return obj.author.username

    def validate_job_title(self, value):
        if len(value.strip()) < 3:
            raise serializers.ValidationError("Job title must be at least 3 characters long.")
        return value.strip()

    def validate_job_company(self, value):
        if len(value.strip()) < 2:
            raise serializers.ValidationError("Company name must be at least 2 characters long.")
        return value.strip()

    def validate_min_salary(self, value):
        # Handle both string and numeric inputs
        if isinstance(value, str):
            if not value.strip():
                raise serializers.ValidationError("Minimum salary is required.")
            return value.strip()
        else:
            # Convert non-string values to string
            if not value:
                raise serializers.ValidationError("Minimum salary is required.")
            return str(value)

    def validate_max_salary(self, value):
        # Handle both string and numeric inputs
        if isinstance(value, str):
            if not value.strip():
                raise serializers.ValidationError("Maximum salary is required.")
            return value.strip()
        else:
            # Convert non-string values to string
            if not value:
                raise serializers.ValidationError("Maximum salary is required.")
            return str(value)


#Search Engine
class JobSearchSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()
    
    class Meta:
        model = JobPosting
        fields = [
            'id',
            'job_title',
            'job_company',
            'job_location',
            'job_setup',
            'job_type',
            'min_salary',
            'max_salary',
            'job_description',
            'job_requirements',
            'job_benefits',
            'created_at',
            'author_name'
        ]
    
    def get_author_name(self, obj):
        if obj.author.first_name and obj.author.last_name:
            return f"{obj.author.first_name} {obj.author.last_name}"
        return obj.author.username


#class ApplicationSerializer(serializers.ModelSerializer):
#    class Meta:
#        model = Applications
#        fields = [
#            'id',
#            'user',
#            'job',
#            'application_status',
#            'date'
#        ]
#        extra_kwargs = {
#            'user': {'read_only': True},
#            'date': {'read_only': True}
#        }

#application for job
class ApplicationSerializer(serializers.ModelSerializer):
    job_title = serializers.CharField(source='job.job_title', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)

    class Meta:
        model = Applications
        fields = [
            'id', 'email', 'first_name', 'last_name', 'job', 'job_title', 'application_status', 'date'
        ]
        read_only_fields = ['email', 'first_name', 'last_name', 'application_status', 'date']


class ApplicationStatusUpdateSerializer(serializers.ModelSerializer):
    applicant = serializers.CharField(source='user.username', read_only=True)
    job_title = serializers.CharField(source='job.job_title', read_only=True)

    class Meta:
        model = Applications
        fields = ['id', 'applicant', 'job_title', 'application_status', 'date']
