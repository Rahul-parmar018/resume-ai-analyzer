from django import forms
from django.core.exceptions import ValidationError
import os


class ResumeUploadForm(forms.Form):
    resume = forms.FileField(
        label='Upload Resume',
        widget=forms.FileInput(attrs={'accept': '.pdf,.docx,.doc,.txt', 'class': 'form-control'})
    )
    
    job_title = forms.CharField(
        max_length=100,
        initial='Data Analyst',
        widget=forms.TextInput(attrs={'class': 'form-control'})
    )
    
    job_description = forms.CharField(
        widget=forms.Textarea(attrs={'rows': 8, 'class': 'form-control'}),
        initial="""Requirements:
• SQL proficiency
• Python or R experience
• Data visualization (Tableau, Power BI)
• Statistics knowledge
• Bachelor's degree in relevant field"""
    )
    
    def clean_resume(self):
        file = self.cleaned_data['resume']
        if file.size > 5 * 1024 * 1024:
            raise ValidationError('File size cannot exceed 5MB')
        ext = os.path.splitext(file.name)[1].lower()
        if ext not in ['.pdf', '.docx', '.doc', '.txt']:
            raise ValidationError('Invalid file format')
        return file