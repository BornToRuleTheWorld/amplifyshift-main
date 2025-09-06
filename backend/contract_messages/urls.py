from django.contrib import admin
from django.urls import path
from contract_messages import views

urlpatterns = [
    path('CreateContractMessage/',views.CreateContractMessage.as_view(),name="CreateContractMessage"),
    path('GetContractMessage/',views.GetContractMessage.as_view(),name="GetContractMessage"),
    path('GetContractMessages/',views.GetContractMessages.as_view(),name="GetContractMessages"),
    path('GetUpdateContractMessage/',views.GetUpdateContractMessage.as_view(),name="GetUpdateContractMessage"),
]