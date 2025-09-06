"""
URL configuration for Amplifyshift project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include,re_path
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('api/admin/', admin.site.urls),
    path('api/', include('modules.urls')),
    path('api/', include('invoices.urls')),
    path('api/facility_group/', include('facility_group.urls')),
    path('api/message/', include('job_request_messages.urls')),
    path('api/administrator/', include('administrator.urls')),
    path('api/job_request/', include('job_request.urls')),
    path('api/professional/', include('professional.urls')),
    path('api/contract/', include('contract.urls')),
    path('api/contract_message/', include('contract_messages.urls')),
    path('api/facility/', include('facility.urls')),
    path('api/jobs/', include('jobs.urls')),
    path('api/membership/', include('membership.urls')),
    
    #RQ urls
    re_path(r'^django-rq/', include('django_rq.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
