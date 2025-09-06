from django.contrib import admin
from django.urls import path
from job_request import views

urlpatterns = [
    path('CreateJobRequest/',views.CreateJobRequest.as_view(),name="CreateJobRequest"),
    path('GetJobRequest/',views.GetJobRequest.as_view(),name="GetJobRequest"),
    path('GetAllJobRequest/',views.GetAllJobRequests.as_view(),name="GetAllJobRequest"),
    path('UpdateJobRequestStatus/',views.UpdateJobRequestStatus.as_view(),name="UpdateJobRequestStatus"),
    path('GetRequestHours/',views.GetRequestHours.as_view(),name="GetRequestHours")
]