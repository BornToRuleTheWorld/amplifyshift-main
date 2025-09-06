from django.contrib import admin
from django.urls import path
from job_request_messages import views

urlpatterns = [
    path('CreateMessage/',views.CreateMessage.as_view(),name="CreateMessage"),
    path('GetMessage/',views.GetMessage.as_view(),name="GetMessage"),
    path('GetMessages/',views.GetMessages.as_view(),name="GetMessages"),
    path('GetUpdateMessage/',views.GetUpdateMessage.as_view(),name="GetUpdateMessage"),
]