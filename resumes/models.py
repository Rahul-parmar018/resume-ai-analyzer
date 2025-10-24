from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator, FileExtensionValidator
from django.utils import timezone
import json


class JobPosting(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    company_name = models.CharField(max_length=200, blank=True, null=True)
    location = models.CharField(max_length=200, blank=True, null=True)
    salary_range = models.CharField(max_length=100, blank=True, null=True)
    required_skills = models.TextField(blank=True)
    preferred_skills = models.TextField(blank=True)
    experience_years = models.IntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(50)])
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='job_postings')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.company_name or 'Unknown'}"


class Resume(models.Model):
    file = models.FileField(upload_to='resumes/%Y/%m/%d/', validators=[FileExtensionValidator(allowed_extensions=['pdf', 'docx', 'doc', 'txt'])])
    original_filename = models.CharField(max_length=255)
    file_size = models.IntegerField()
    file_type = models.CharField(max_length=10)
    extracted_text = models.TextField(blank=True)
    candidate_name = models.CharField(max_length=200, blank=True)
    candidate_email = models.EmailField(blank=True)
    candidate_phone = models.CharField(max_length=50, blank=True)
    uploaded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='uploaded_resumes')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    is_analyzed = models.BooleanField(default=False)
    analysis_count = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['-uploaded_at']
    
    def __str__(self):
        return f"{self.candidate_name or 'Unknown'} - {self.original_filename}"


class AnalysisResult(models.Model):
    MATCH_LEVELS = [
        ('strong', 'Strong Match'),
        ('good', 'Good Match'),
        ('moderate', 'Moderate Match'),
        ('weak', 'Weak Match'),
        ('unknown', 'Unknown'),
    ]
    
    ANALYZER_TYPES = [
        ('gpt', 'OpenAI GPT'),
        ('gemini', 'Google Gemini'),
        ('local', 'Local Analysis'),
    ]
    
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE, related_name='analyses', null=True, blank=True)
    job_posting = models.ForeignKey(JobPosting, on_delete=models.SET_NULL, null=True, blank=True, related_name='analyses')
    analyzed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='analyses')
    candidate_name = models.CharField(max_length=200, default='Unknown')
    candidate_email = models.EmailField(blank=True)
    candidate_phone = models.CharField(max_length=50, blank=True)
    job_title = models.CharField(max_length=200, default='Unknown Position')
    total_score = models.FloatField(validators=[MinValueValidator(0), MaxValueValidator(100)])
    technical_skills_score = models.FloatField(default=0, validators=[MinValueValidator(0), MaxValueValidator(40)])
    experience_score = models.FloatField(default=0, validators=[MinValueValidator(0), MaxValueValidator(30)])
    education_score = models.FloatField(default=0, validators=[MinValueValidator(0), MaxValueValidator(15)])
    tools_score = models.FloatField(default=0, validators=[MinValueValidator(0), MaxValueValidator(15)])
    match_level = models.CharField(max_length=20, choices=MATCH_LEVELS, default='unknown')
    skills_found = models.TextField(blank=True)
    missing_skills = models.TextField(blank=True)
    recommendations = models.TextField(blank=True)
    summary = models.TextField(blank=True)
    full_analysis = models.TextField(blank=True)
    analyzer_used = models.CharField(max_length=20, choices=ANALYZER_TYPES, default='local')
    analysis_date = models.DateTimeField(auto_now_add=True)
    processing_time = models.FloatField(default=0)
    
    class Meta:
        ordering = ['-analysis_date']
    
    def __str__(self):
        return f"{self.candidate_name} - {self.job_title} ({self.total_score}%)"
    
    def get_skills_found_list(self):
        try:
            return json.loads(self.skills_found) if self.skills_found else []
        except:
            return []
    
    def get_missing_skills_list(self):
        try:
            return json.loads(self.missing_skills) if self.missing_skills else []
        except:
            return []


class BatchAnalysis(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]
    
    job_posting = models.ForeignKey(JobPosting, on_delete=models.SET_NULL, null=True, blank=True, related_name='batch_analyses')
    job_title = models.CharField(max_length=200)
    total_resumes = models.IntegerField(default=0)
    processed_resumes = models.IntegerField(default=0)
    failed_resumes = models.IntegerField(default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    results = models.ManyToManyField(AnalysisResult, related_name='batch_analysis', blank=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Batch - {self.job_title} ({self.processed_resumes}/{self.total_resumes})"


class APIUsage(models.Model):
    API_TYPES = [
        ('openai', 'OpenAI'),
        ('gemini', 'Google Gemini'),
    ]
    
    api_type = models.CharField(max_length=20, choices=API_TYPES)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    endpoint = models.CharField(max_length=100)
    model_used = models.CharField(max_length=50)
    prompt_tokens = models.IntegerField(default=0)
    completion_tokens = models.IntegerField(default=0)
    total_tokens = models.IntegerField(default=0)
    estimated_cost = models.DecimalField(max_digits=10, decimal_places=6, default=0)
    success = models.BooleanField(default=True)
    error_message = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-timestamp']
    
    def __str__(self):
        return f"{self.api_type} - {self.model_used} ({self.total_tokens} tokens)"


class UserPreferences(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='resume_preferences')
    default_job_title = models.CharField(max_length=200, blank=True)
    default_analyzer = models.CharField(max_length=20, choices=[('gpt', 'GPT'), ('gemini', 'Gemini'), ('local', 'Local')], default='gpt')
    email_on_completion = models.BooleanField(default=True)
    preferred_gpt_model = models.CharField(max_length=50, default='gpt-3.5-turbo')
    results_per_page = models.IntegerField(default=10)
    
    def __str__(self):
        return f"Preferences for {self.user.username}"


# ===== FINDER MODELS =====

class Requisition(models.Model):
    title = models.CharField(max_length=200)
    must_have = models.JSONField(default=list, blank=True)
    nice_to_have = models.JSONField(default=list, blank=True)
    min_exp = models.IntegerField(default=0)
    location = models.CharField(max_length=200, blank=True)
    notes = models.TextField(blank=True)
    shortlist_threshold = models.IntegerField(default=75)  # >= auto-shortlist hint
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


def resume_upload_path(instance, filename):
    return f"resumes/{instance.requisition_id}/{filename}"


STATUS_CHOICES = [
    ('new','New'), ('shortlisted','Shortlisted'),
    ('rejected','Not selected'), ('hired','Hired'),
]


class Candidate(models.Model):
    requisition = models.ForeignKey(Requisition, on_delete=models.CASCADE, related_name='candidates')
    file = models.FileField(upload_to=resume_upload_path, blank=True, null=True)
    file_name = models.CharField(max_length=255, blank=True)
    file_hash = models.CharField(max_length=64, blank=True)  # duplicate detection
    # parsed
    name = models.CharField(max_length=200, blank=True)
    email = models.CharField(max_length=200, blank=True)
    phone = models.CharField(max_length=100, blank=True)
    linkedin = models.CharField(max_length=255, blank=True)
    location = models.CharField(max_length=200, blank=True)
    years_experience = models.IntegerField(default=0)
    # summary + insights
    summary = models.TextField(blank=True)
    insights = models.TextField(blank=True)
    notes = models.TextField(blank=True)
    # scores
    match_score = models.IntegerField(default=0)
    total_score = models.IntegerField(default=0)
    ats_score = models.IntegerField(default=0)
    skills_score = models.IntegerField(default=0)
    readability_score = models.IntegerField(default=0)
    structure_score = models.IntegerField(default=0)
    # keywords
    present_keywords = models.TextField(blank=True)  # semicolon list
    missing_keywords = models.TextField(blank=True)  # semicolon list
    # status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-match_score','-total_score','-created_at']