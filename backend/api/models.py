from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    username = models.CharField(max_length=150, blank=True, null=True, unique=False)
    email = models.EmailField(unique=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email


class JobPosting(models.Model):
    JOB_SETUP_CHOICES = [
        ('Onsite', 'Onsite'),
        ('Remote', 'Remote'),
        ('Hybrid', 'Hybrid'),
    ]

    JOB_TYPE_CHOICES = [
        ('Full-Time', 'Full-Time'),
        ('Part-Time', 'Part-Time'),
        ('Contract', 'Contract'),
        ('Internship', 'Internship'),
    ]

    job_title = models.CharField(max_length=255)
    job_company = models.CharField(max_length=100)
    job_setup = models.CharField(max_length=10 , choices=JOB_SETUP_CHOICES)
    job_type = models.CharField(max_length=15, choices=JOB_TYPE_CHOICES)
    job_salary = models.DecimalField(max_digits=10, decimal_places=2)
    job_description = models.CharField()
    job_requirements = models.TextField()
    job_benefits = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(AbstractUser, on_delete=models.CASCADE, related_name='jobposting')

    def __str__(self):
        return self.job_title

class Application(models.Model):
    APPLICATION_STATUS_CHOICES = [
        ('Applied', 'Applied'),
        ('Under Review', 'Under Review'),
        ('Interview', 'Interview'),
        ('Accepted', 'Accepted'),
        ('Rejected', 'Rejected'),
    ]

    application_status = models.CharField(max_length=12, choices=APPLICATION_STATUS_CHOICES)
    date = models.DateField()

    # (1): di ko alam kung ano ilalagay sa return at di ko rin alam kung pano sa foreign key since id sya #

class Links(models.Model):
    portfolio = models.TextField()
    linkedin = models.TextField()
    github = models.TextField()

    # (1) #

class Bookmark(models.Model):
    favorite = models.BooleanField

    # (1) #