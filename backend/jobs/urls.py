from django.contrib import admin
from django.urls import path
from jobs import views

urlpatterns = [
    path('CreateJobs/',views.CreateJobs.as_view(),name="CreateJobs"),
    path('GetJobs/',views.GetJobs.as_view(),name="GetJobs"),
    path('GetAllJobs/',views.GetAllJobs.as_view(),name="GetJobs"),
    path('UpdateJobs/<int:id>/',views.UpdateJobs.as_view(),name="UpdateJobs"),
    path('DeleteJobs/<int:id>/',views.DeleteJobs.as_view(),name="DeleteJobs"),
    path('JobSearch/',views.JobSearch.as_view(),name="JobSearch"),

    path('CreateJobWorkHours/',views.CreateJobWorkHours.as_view(),name="CreateJobWorkHours"),
    path('GetJobWorkHours/',views.GetJobWorkHours.as_view(),name="GetJobWorkHours"),
    path('DeleteJobWorkHours/', views.DeleteJobWorkHours.as_view(), name="DeleteJobWorkHours"),
    path('DeleteJobHours/', views.DeleteJobHours.as_view(), name="DeleteJobHours"),

    #JobHours
    path('JobHours/', views.JobHoursViewSet.as_view({'get': 'list', 'post': 'create'}), name='hours-create-list'),
    path('JobHours/<int:pk>/', views.JobHoursViewSet.as_view({'get': 'retrieve','put': 'update','patch': 'partial_update','delete': 'destroy'}), name='hours-detail'),
]