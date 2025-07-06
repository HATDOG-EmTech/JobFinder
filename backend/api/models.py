from django.db import models
from django.contrib.auth.models import AbstractUser

# Custom user model
class CustomUser(AbstractUser):
    GENDER_CHOICES = {
        'Male': 'Male',
        'Female': 'Female',
        'Others': 'Others',
        'Prefer not to Say': 'Prefer not to Say'}

    ROLE_CHOICES = {
        'User': 'User',
        'Admin': 'Admin'}

    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    email = models.EmailField(unique=True)
    gender = models.CharField(max_length=18, choices=GENDER_CHOICES)
    mobile = models.CharField(max_length=11)
    location = models.CharField(max_length=100)
    user_title = models.CharField(max_length=30, blank=True)
    bio = models.CharField(max_length=500, blank=True)
    skills = models.CharField(max_length=500, blank=True)
    linkedin = models.URLField(max_length=500, blank=True)
    github = models.URLField(max_length=500, blank=True)
    role = models.CharField(max_length=5, choices=ROLE_CHOICES, default='User')

    USERNAME_FIELD = 'username' 
    REQUIRED_FIELDS = ['email'] 

    def __str__(self):
        return self.username

# Job Posting Model
class JobPosting(models.Model):
    JOB_SETUP_CHOICES = {
        'Onsite': 'Onsite',
        'Remote': 'Remote',
        'Hybrid': 'Hybrid' }

    JOB_TYPE_CHOICES = {
        'Full-Time': 'Full-Time',
        'Part-Time': 'Part-Time',
        'Contract': 'Contract',
        'Internship': 'Internship'}

    job_title = models.CharField(max_length=255)
    job_company = models.CharField(max_length=100)
    job_location = models.CharField(max_length=100)
    job_setup = models.CharField(max_length=10, choices=JOB_SETUP_CHOICES)
    job_type = models.CharField(max_length=15, choices=JOB_TYPE_CHOICES)
    min_salary= models.DecimalField(max_digits=10, decimal_places=2)
    max_salary= models.DecimalField(max_digits=10, decimal_places=2)
    job_description = models.TextField()
    job_requirements = models.TextField()
    job_benefits = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey('CustomUser', on_delete=models.CASCADE, related_name='job_postings')

    def __str__(self):
        return f"{self.job_title} at {self.job_company}"


# Applications Model
class Applications(models.Model):
    STATUS_CHOICES = {
        'Under Review': 'Under Review',
        'Interview': 'Interview',
        'Accepted': 'Accepted',
        'Rejected': 'Rejected',
    }

    user = models.ForeignKey('CustomUser', on_delete=models.CASCADE, related_name='applications')
    job = models.ForeignKey(JobPosting, on_delete=models.CASCADE, related_name='applications')
    application_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Under Review')
    date = models.DateField(auto_now_add=True)

    class Meta:

        unique_together = ('user', 'job')

    def __str__(self):
        return f"{self.user.email} applied for {self.job.job_title}"


