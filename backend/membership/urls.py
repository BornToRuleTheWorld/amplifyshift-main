from django.contrib import admin
from django.urls import path
from membership import views

urlpatterns = [
    path('CreateMembership/',views.CreateMembership.as_view(),name="CreateMembership"),   
    path('GetAllMemberships/',views.GetAllMemberships.as_view(),name="GetAllMemberships"),
    path('GetMembership/',views.GetMembership.as_view(),name="GetMembership"),
    path('UpdateMembership/<int:id>/',views.UpdateMembership.as_view(),name="UpdateMembership"),

    path('CreateFeature/',views.CreateFeature.as_view(),name="CreateFeature"),
    path('DeleteFeature/<int:id>/',views.DeleteFeature.as_view(),name="DeleteFeature"),
]