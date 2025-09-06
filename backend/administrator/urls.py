from django.urls import path
from administrator import views

urlpatterns = [
    path('GetUsers/', views.GetUsers.as_view(),name="GetUsers"),
    path('AdminSearch/', views.AdminSearch.as_view(),name="AdminSearch"),
    path('AdminUser/', views.AdminUserViewSet.as_view({'get': 'list', 'post': 'create'}), name='AdminUser'),
    path('AdminUser/<int:pk>/', views.AdminUserViewSet.as_view({'get': 'retrieve','put': 'update','patch': 'partial_update','delete': 'destroy'}), name='AdminUserOthers'),

    # Dashboard
    path('GetTotalCount/', views.GetTotalCount.as_view(),name="GetTotalCount"),
    path('WeeklyShifts/', views.WeeklyShifts.as_view(),name="WeeklyShifts"),
    path('AdminShifts/', views.AdminShifts.as_view(),name="AdminShifts"),
    path('AdminInvoices/', views.AdminInvoices.as_view(),name="AdminInvoices")
]