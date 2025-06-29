from django.contrib.auth.models import User
from rest_framework import serializers
from .models import JobPosting 
from .models import Applications
from .models import Links
from .models import Bookmark

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

class ApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Applications
        fields = [
            'id',
            'application_status',
            'date'
        ]

class LinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Links
        fields = [
            'id',
            'portfolio',
            'linkedin',
            'github'
        ]

class Bookmark(serializers.ModelSerializer):
    class Meta:
        model = Bookmark
        fields  = [
            'id',
            'bookmark'
        ]

    # not sure sa 'id', ginaya ko lang sa JobSerializer mo #