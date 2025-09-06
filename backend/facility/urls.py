from django.contrib import admin
from django.urls import path
from facility import views

urlpatterns = [
    path('CreateFacility/', views.CreateFacility.as_view(),name="CreateFacility"),
    path('GetFacility/', views.GetFacility.as_view(),name="GetFacility"),
    path('GetFacilities/', views.GetFacilities.as_view(),name="GetFacilities"),
    path('UpdateFacility/<str:email>/', views.UpdateFacility.as_view(), name='UpdateFacility'),
    path('facilitySearch/',views.GetSearchProf.as_view(), name="facilitySearch"),
    path('CreateFacSearch/',views.CreateFacSearch.as_view(),name="CreateFacSearch"),
    path('FacilityHours/', views.FacilityHours.as_view(), name="FacilityHours"),

    path('GetContractProf/', views.GetContractProfessionals.as_view(), name="GetContractProf"),

    path('preference/', views.PreferenceViewSet.as_view({'get': 'list', 'post': 'create'}), name='preference-create-list'),
    path('preference/<int:pk>/', views.PreferenceViewSet.as_view({'get': 'retrieve','put': 'update','patch': 'partial_update','delete': 'destroy'}), name='preference-detail'),

    path('document/', views.FacilityDocViewSet.as_view({'get': 'list', 'post': 'create'}), name='doc-create-list'),
    path('document/<int:pk>/', views.FacilityDocViewSet.as_view({'get': 'retrieve','put': 'update','patch': 'partial_update','delete': 'destroy'}), name='doc-detail'),


    #dasnboard
    path('FacilityActiveCount/', views.FacilityActiveCount.as_view(), name="FacilityActiveCount"),
    path('FacilityTotalCount/', views.FacilityTotalCount.as_view(), name="FacilityTotalCount"),
    path('FacilityShifts/', views.FacilityShifts.as_view(), name="FacilityShifts"),
    path('FacilityNotications/', views.FacilityNotications.as_view(), name="FacilityNotications"),
    path('FacilityInvoices/', views.FacilityInvoices.as_view(), name="FacilityInvoices"),
    path('FacilityWeeklyShifts/', views.FacilityWeeklyShifts.as_view(), name="FacilityWeeklyShifts"),

]