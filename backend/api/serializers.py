from django.contrib.auth.models import User
from rest_framework import serializers
from .models import JobPosting 

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
    
class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobPosting
        fields = [
            'id',
            'job_title',
            'job_company',
            'job_setup',
            'job_type',
            'job_salary',
            'job_description',
            'job_requirements',
            'job_benefits',
            'created_at',
            'author'
        ]