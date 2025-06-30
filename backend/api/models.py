from django.db import models
from django.contrib.auth.models import AbstractUser

# Custom user model
class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)

    USERNAME_FIELD = 'username'  # Default
    REQUIRED_FIELDS = ['email']  # Email is required in addition to username

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
    job_setup = models.CharField(max_length=10, choices=JOB_SETUP_CHOICES)
    job_type = models.CharField(max_length=15, choices=JOB_TYPE_CHOICES)
    job_salary = models.DecimalField(max_digits=10, decimal_places=2)
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
        'Applied': 'Applied',
        'Under Review': 'Under Review',
        'Interview': 'Interview',
        'Accepted': 'Accepted',
        'Rejected': 'Rejected'}

    user = models.ForeignKey('CustomUser', on_delete=models.CASCADE, related_name='applications')
    job = models.ForeignKey(JobPosting, on_delete=models.CASCADE, related_name='applications')
    application_status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    date = models.DateField()

    class Meta:
        unique_together = ('user', 'job')

    def __str__(self):
        return f"{self.user.email} applied for {self.job.job_title}"


# Links Model
class Links(models.Model):
    user = models.OneToOneField('CustomUser', on_delete=models.CASCADE, related_name='links')
    portfolio = models.URLField(max_length=500, blank=True)
    linkedin = models.URLField(max_length=500, blank=True)
    github = models.URLField(max_length=500, blank=True)

    def __str__(self):
        return f"Links for {self.user.email}"


# Bookmark Model
class Bookmark(models.Model):
    user = models.ForeignKey('CustomUser', on_delete=models.CASCADE, related_name='bookmarks')
    job = models.ForeignKey(JobPosting, on_delete=models.CASCADE, related_name='bookmarked_by')
    favorite = models.BooleanField(default=True)

    class Meta:
        unique_together = ('user', 'job')

    def __str__(self):
        return f"{self.user.email} bookmarked {self.job.job_title}"
