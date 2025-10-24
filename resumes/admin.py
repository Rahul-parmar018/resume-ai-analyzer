from django.contrib import admin
from django.utils.html import format_html
from .models import JobPosting, Resume, AnalysisResult, BatchAnalysis, APIUsage, UserPreferences, Requisition, Candidate


@admin.register(JobPosting)
class JobPostingAdmin(admin.ModelAdmin):
    list_display = ['title', 'company_name', 'experience_years', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['title', 'company_name']


@admin.register(Resume)
class ResumeAdmin(admin.ModelAdmin):
    list_display = ['candidate_name', 'candidate_email', 'file_type', 'is_analyzed', 'uploaded_at']
    list_filter = ['is_analyzed', 'file_type']
    search_fields = ['candidate_name', 'candidate_email']


@admin.register(AnalysisResult)
class AnalysisResultAdmin(admin.ModelAdmin):
    list_display = ['candidate_name', 'job_title', 'total_score', 'match_level', 'analyzer_used', 'analysis_date']
    list_filter = ['match_level', 'analyzer_used']
    search_fields = ['candidate_name', 'job_title']


@admin.register(BatchAnalysis)
class BatchAnalysisAdmin(admin.ModelAdmin):
    list_display = ['job_title', 'total_resumes', 'processed_resumes', 'status', 'created_at']
    list_filter = ['status']


@admin.register(APIUsage)
class APIUsageAdmin(admin.ModelAdmin):
    list_display = ['api_type', 'model_used', 'total_tokens', 'success', 'timestamp']
    list_filter = ['api_type', 'success']


@admin.register(UserPreferences)
class UserPreferencesAdmin(admin.ModelAdmin):
    list_display = ['user', 'default_job_title', 'default_analyzer']


@admin.register(Requisition)
class RequisitionAdmin(admin.ModelAdmin):
    list_display = ('id','title','min_exp','location','shortlist_threshold','created_at')
    search_fields = ('title','location')


@admin.register(Candidate)
class CandidateAdmin(admin.ModelAdmin):
    list_display = ('id','requisition','name','email','match_score','status','created_at')
    list_filter = ('status','requisition')
    search_fields = ('name','email','phone','linkedin','file_name')