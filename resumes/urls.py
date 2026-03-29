from django.urls import path
from . import views
from . import views_finder as fv
from . import views_review as rv

urlpatterns = [
    # 🎯 Primary AI Analysis API
    path('analyze/', views.analyze_resume_view, name='analyze_api'),
    path('status/', views.check_api_status, name='api_status'),
    
    # 🔍 Candidate Finder APIs (Multi-resume filtering)
    path('requisitions/', fv.api_requisition_create, name='api_requisition_create'),
    path('requisitions/<int:req_id>/', fv.api_requisition_get, name='api_requisition_get'),
    path('requisitions/<int:req_id>/upload/', fv.api_upload_analyze, name='api_upload_analyze'),
    path('requisitions/<int:req_id>/candidates/', fv.api_candidates_list, name='api_candidates_list'),
    path('requisitions/<int:req_id>/metrics/', fv.api_requisition_metrics, name='api_requisition_metrics'),
    path('requisitions/<int:req_id>/rescore/', fv.api_requisition_rescore, name='api_requisition_rescore'),
    path('requisitions/<int:req_id>/reset/', fv.api_requisition_reset, name='api_requisition_reset'),
    path('candidates/<int:cand_id>/', fv.api_candidate_update, name='api_candidate_update'),
    
    # 📊 Quick Scoring API
    path('score/', views.api_score, name='api_score'),
    
    # 🎨 Resume Review & Improvement APIs
    path('review-resume/', rv.api_review_resume, name='api_review_resume'),
]