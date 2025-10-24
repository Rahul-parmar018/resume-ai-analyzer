from django.urls import path
from . import views
from . import views_finder as fv
from . import views_review as rv

urlpatterns = [
    # Your existing URLs
    path('', views.home, name='home'),
    path('examples/', views.examples, name='examples'),
    path('resume-examples/', views.resume_examples, name='resume_examples'),
    path('requirements/', views.requirements_view, name='requirements'),
    path('upload/', views.upload_view, name='upload'),
    path('results/', views.results_view, name='results'),
    
    # New GPT-powered URLs
    path('ai-upload/', views.upload_resume_gpt, name='upload_resume_gpt'),
    path('ai-results/', views.resume_results_gpt, name='resume_results_gpt'),
    path('api/analyze/', views.analyze_resume_api, name='analyze_api'),
    path('api/status/', views.check_api_status, name='api_status'),
    path('batch/', views.batch_analyze_resumes, name='batch_analyze'),
    path('download/<str:format>/', views.download_results, name='download_results'),
    path('clear-session/', views.clear_session_data, name='clear_session'),
    
        # Score Checker page
        path('score-checker/', views.score_checker, name='score_checker'),
        
        # Score Checker API
        path('api/score/', views.api_score, name='api_score'),
        
        # Finder URLs
        path('finder/', fv.finder_list, name='finder_list'),
        path('finder/<int:req_id>/', fv.finder_detail, name='finder_detail'),
        # APIs
        path('api/requisitions/', fv.api_requisition_create, name='api_requisition_create'),
        path('api/requisitions/<int:req_id>/', fv.api_requisition_get, name='api_requisition_get'),
        path('api/requisitions/<int:req_id>/upload/', fv.api_upload_analyze, name='api_upload_analyze'),
        path('api/requisitions/<int:req_id>/candidates/', fv.api_candidates_list, name='api_candidates_list'),
        path('api/requisitions/<int:req_id>/export.csv', fv.api_export_csv, name='api_export_csv'),
        path('api/requisitions/<int:req_id>/compare/', fv.finder_compare, name='finder_compare'),
        path('api/requisitions/<int:req_id>/metrics/', fv.api_requisition_metrics, name='api_requisition_metrics'),
        path('api/requisitions/<int:req_id>/rescore/', fv.api_requisition_rescore, name='api_requisition_rescore'),
        path('api/requisitions/<int:req_id>/reset/', fv.api_requisition_reset, name='api_requisition_reset'),
        path('api/candidates/<int:cand_id>/', fv.api_candidate_update, name='api_candidate_update'),
        
        # Review URLs
        path('review-resume/', rv.review_resume, name='review_resume'),
        path('api/review-resume/', rv.api_review_resume, name='api_review_resume'),
        path('improve-resume/', rv.improve_resume, name='improve_resume'),
]