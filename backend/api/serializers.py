from rest_framework import serializers
from .models import JobPosting, Applications, Links, Bookmark, CustomUser

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
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

class LinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Links
        fields = [
            'id',
            'user',
            'portfolio',
            'linkedin',
            'github'
        ]
        extra_kwargs = {
            'user': {'read_only': True}
        }

class BookmarkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bookmark
        fields = [
            'id',
            'user',
            'job',
            'favorite'
        ]
        extra_kwargs = {
            'user': {'read_only': True}
        }
