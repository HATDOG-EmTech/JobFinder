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
