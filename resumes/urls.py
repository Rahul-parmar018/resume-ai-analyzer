from django.urls import path
from . import views
from . import views_finder as fv
from . import views_review as rv

urlpatterns = [
    # 🎯 Primary SaaS Phase 4 API Loop & Phase 2 Intelligence
    path('optimize/', views.optimize_resume_view, name='optimize_api'),
    path('bulk-analyze/', views.bulk_analyze_view, name='bulk_analyze_api'),
    path('dashboard/', views.get_dashboard_analytics_view, name='dashboard_api'),
    path('semantic-search/', views.semantic_search_view, name='semantic_search_api'),
    path('history/', views.get_history_view, name='get_history_api'),
    path('analysis/<int:pk>/', views.analysis_detail_view, name='analysis_detail_api'),
    path('user/profile/', views.get_user_profile_view, name='user_profile_api'),
    path('user/update-role/', views.update_user_role_view, name='update_role_api'),
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