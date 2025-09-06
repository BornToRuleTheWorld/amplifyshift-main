from django.contrib import admin
from django.urls import path
from facility_group import views

urlpatterns = [
    path('CreateFacilityGroup/',views.CreateFacilityGroup.as_view(), name="CreateFacilityGroup"),
    path('GetFacilityGroup/',views.GetFacilityGroup.as_view(), name="GetFacilityGroup"),
    path('UpdateFacilityGroup/<str:email>/', views.UpdateFacilityGroup.as_view(), name='UpdateFacilityGroup'),
    path('CreateFacilityGrpLink/',views.CreateFacilityGrpLink.as_view(), name="CreateFacilityGrpLink"),
]