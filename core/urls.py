from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import RedirectView

from resumes import views as resume_views

urlpatterns = [
    path("", resume_views.check_api_status, name="health_check"),
    path("admin/", admin.site.urls),
    path("api/", include("resumes.urls")),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)