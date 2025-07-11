from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, JobPosting, Applications


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    model = CustomUser

    list_display = (
        'username', 'email', 'first_name', 'last_name',
        'gender', 'mobile', 'location', 'role',
        'is_active', 'is_staff', 'is_superuser'
    )
    list_filter = ('gender', 'role', 'is_active', 'is_staff', 'is_superuser')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    ordering = ('username',)

    readonly_fields = ('last_login', 'date_joined')

    fieldsets = (
        (None, {'fields': ('username', 'email')}),
        ('Personal Info', {
            'fields': (
                'first_name', 'last_name', 'gender', 'mobile', 'location',
                'user_title', 'bio', 'skills', 'linkedin', 'github', 'role'
            )
        }),
        ('Permissions', {
            'fields': (
                'is_active', 'is_staff', 'is_superuser',
                'groups', 'user_permissions'
            )
        }),
        ('Important Dates', {'fields': ('last_login', 'date_joined')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': (
                'username', 'email', 'password1', 'password2',
                'first_name', 'last_name', 'gender', 'mobile', 'location',
                'user_title', 'bio', 'skills', 'linkedin', 'github', 'role',
                'is_active', 'is_staff', 'is_superuser', 'groups'
            ),
        }),
    )

    def has_delete_permission(self, request, obj=None):
        return True  # ✅ allow delete


@admin.register(JobPosting)
class JobPostingAdmin(admin.ModelAdmin):
    list_display = (
        'job_title', 'job_company', 'job_location',
        'job_setup', 'job_type', 'min_salary', 'max_salary',
        'created_at', 'author'
    )
    list_filter = (
        'job_type', 'job_setup', 'job_company',
        ('created_at', admin.DateFieldListFilter),  
    )
    search_fields = ('job_title', 'job_company', 'job_location')
    ordering = ('-created_at',)

    def has_delete_permission(self, request, obj=None):
        return True  


@admin.register(Applications)
class ApplicationsAdmin(admin.ModelAdmin):
    list_display = ('user', 'job', 'application_status', 'date')
    list_filter = (
        'application_status',
        ('date', admin.DateFieldListFilter),  # ✅ Filter by date applied
    )
    search_fields = ('user__username', 'user__email', 'job__job_title')
    ordering = ('-date',)


admin.site.site_header = "JobFinder Admin"
admin.site.site_title = "JobFinder Admin Portal"
admin.site.index_title = "Welcome to the JobFinder Dashboard"
