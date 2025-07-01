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
        fields = ['username', 'email', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        return CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
    
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [
            'id', 'username', 'email',
            'first_name', 'last_name', 'gender', 'mobile',
            'location', 'user_title', 'bio', 'skills',
            'linkedin', 'github'
        ]
        read_only_fields = ['id', 'username', 'email']  # prevent updating these from here



class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobPosting
        fields = [
            'id',
            'job_title',
            'job_company',
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

class ApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Applications
        fields = [
            'id',
            'user',
            'job',
            'application_status',
            'date'
        ]
        extra_kwargs = {
            'user': {'read_only': True},
            'date': {'read_only': True}
        }
