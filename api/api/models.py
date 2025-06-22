from django.db import models
from django.contrib.auth.models import User

class users_tb(models.Model):
    user_id = models.AutoField(max_digits=11, primary_key=True)
    f_name = models.CharField(max_length=30, null=False)
    l_name = models.CharField(max_length=20, null=False)
    m_initial = models.CharField(max_length=3, null=False)
    email = models.CharField(max_length=50, null=False)
    password = models.CharField(max_length=50, null=False)
    phone = models.CharField(max_length=15, null=False)
    location = models.CharField(max_length=100, null=False)
    user_title = models.CharField(max_length=30, null=False)
    bio = models.CharField(max_length=500, null=False)
    skills = models.CharField(max_length=500, null=False)
    cv_path = models.CharField(max_length=500, null=False)
