from django.urls import path
from contract import views

urlpatterns = [
    path('CreateContract/', views.CreateContract.as_view(),name="CreateContract"),
    path('GetContracts/', views.GetContracts.as_view(),name="GetContracts"),
    path('GetAllContracts/', views.GetAllContracts.as_view(),name="GetAllContracts"),
    path('GetAllContract/', views.GetAllContract.as_view(),name="GetAllContract"),
    path('GetContract/', views.GetContract.as_view(),name="GetContract"),
    path('UpdateContract/<int:id>/', views.UpdateContract.as_view(),name="UpdateContract"),
    path('SearchContract/', views.SearchContract.as_view(),name="SearchContract"),
    path('GetContractHours/', views.GetContractHours.as_view(),name="GetContractHours"),
    path('GetUserContractHours/', views.GetUserContractHours.as_view(),name="GetUserContractHours"),
    path('GetAllContractHours/', views.GetAllContractHours.as_view(),name="GetAllContractHours"),
    path('ContractWorkHourStatus/', views.ContractWorkHourStatus.as_view(),name="ContractWorkHourStatus"),
    path('BillableContractHours/', views.BillableContractHours.as_view(),name="BillableContractHours"),
    path('GetInvoiceCreateHrs/', views.GetInvoiceCreateHrs.as_view(),name="GetInvoiceCreateHrs"),
]