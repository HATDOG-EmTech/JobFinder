from rest_framework import serializers
from .models import JobPosting, Applications, CustomUser

#class UserSerializer(serializers.ModelSerializer):
#    class Meta:
#        model = CustomUser
#        fields = ['id', 'username', 'email', 'password']
#        extra_kwargs = {
#            'password': {'write_only': True}
#        }

#    def create(self, validated_data):
#        user = CustomUser.objects.create_user(
#            username=validated_data['username'],
#            email=validated_data['email'],
#            password=validated_data['password']
#        )
#        return user


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [
            'username', 'email', 'password',
            'gender', 'mobile', 'location',
            'user_title', 'bio', 'skills',
            'linkedin', 'github', 'role'
        ]
        extra_kwargs = {
            'password': {'write_only': True},
            'role': {'default': 'user'}
        }

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
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



class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        # Explicitly list only the fields you want to expose
        fields = [
            'username', 'email', 'first_name', 'last_name', 'gender',
            'mobile', 'location', 'user_title', 'bio', 'skills',
            'linkedin', 'github', 'role'
        ]
        extra_kwargs = {
            'email': {'read_only': True},  # Optional: prevent email editing
        }




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


class JobSerializer(serializers.ModelSerializer):
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
            'author'
        ]
        extra_kwargs = {
            'author': {'read_only': True}
        }


#Search Engine
class JobSearchSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobPosting
        fields = ['id', 'job_title', 'job_company', 'job_location', 'job_description']


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


