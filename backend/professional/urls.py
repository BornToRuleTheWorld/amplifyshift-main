from django.contrib import admin
from django.urls import path
from professional import views

urlpatterns = [
    path('createProf/', views.CreateProfessional.as_view(),name="createProf"),
    path('getProf/', views.GetProfessional.as_view(),name="getProf"),
    path('GetProfessionals/', views.GetProfessionals.as_view(),name="GetProfessionals"),
    path('updateProf/<str:email>/', views.UpdateProfessional.as_view(), name='updateProf'),
    path('DeleteProf/<int:id>/', views.DeleteProfessional.as_view(), name='DeleteProf'),
    path('SearchProfSlot/', views.SearchProfSlot.as_view(), name='SearchProfSlot'),
    path('SendVerifyEmail/', views.SendVerifyEmail.as_view(), name='SendVerifyEmail'),
    
    path('CreateProfVerifyQA/', views.CreateProfVerifyQA.as_view(), name='CreateProfVerifyQA'),
    path('VerifyQA/', views.VerifyQA.as_view(), name='VerifyQA'),
    
    path('UpdateRefMail/<int:id>/', views.UpdateRefMail.as_view(), name='UpdateRefMail'),
    path('UpdateProfStatus/<int:id>/', views.UpdateProfStatus.as_view(), name='UpdateProfStatus'),

    path('GetRequestedHours/', views.GetRequestedHours.as_view(), name='GetRequestedHours'),
    path('GetContractHours/', views.GetContractHours.as_view(), name='GetContractHours'),

    #slots
    path('CreateProfSlot/', views.CreateProfSlot.as_view(), name='createProfSlot'),
    path('GetProfSlot/',views.GetProfSlot.as_view(), name='getProfSlot'),
    path('GetHourSlots/',views.GetHourSlots.as_view(), name='GetHourSlots'),

    #License
    path('CreateLicense/', views.CreateLicense.as_view(), name='CreateLicense'),
    path('licenses/', views.LicenseViewSet.as_view({'get': 'list', 'post': 'create'}), name='license-create-list'),
    path('licenses/<int:pk>/', views.LicenseViewSet.as_view({'get': 'retrieve','put': 'update','patch': 'partial_update','delete': 'destroy'}), name='license-detail'),

    #Education
    path('education/', views.EducationViewSet.as_view({'get': 'list', 'post': 'create'}), name='education-create-list'),
    path('education/<int:pk>/', views.EducationViewSet.as_view({'get': 'retrieve','put': 'update','patch': 'partial_update','delete': 'destroy'}), name='education-detail'),

    #Cerifications
    path('certifications/', views.CertificationViewSet.as_view({'get': 'list', 'post': 'create'}), name='cerification-create-list'),
    path('certifications/<int:pk>/', views.CertificationViewSet.as_view({'get': 'retrieve','put': 'update','patch': 'partial_update','delete': 'destroy'}), name='cerification-detail'),

    #ProfessionalReferences
    path('references/', views.ReferenceViewSet.as_view({'get': 'list', 'post': 'create'}), name='reference-create-list'),
    path('references/<int:pk>/', views.ReferenceViewSet.as_view({'get': 'retrieve','put': 'update','patch': 'partial_update','delete': 'destroy'}), name='reference-detail'),

    #EmergencyContact
    path('contact/', views.ContactViewSet.as_view({'get': 'list', 'post': 'create'}), name='contact-create-list'),
    path('contact/<int:pk>/', views.ContactViewSet.as_view({'get': 'retrieve','put': 'update','patch': 'partial_update','delete': 'destroy'}), name='contact-detail'),

    #Employee history
    path('history/', views.HistoryViewSet.as_view({'get': 'list', 'post': 'create'}), name='history-create-list'),
    path('history/<int:pk>/', views.HistoryViewSet.as_view({'get': 'retrieve','put': 'update','patch': 'partial_update','delete': 'destroy'}), name='history-detail'),

    #Skills
    path('skills/', views.SkillsViewSet.as_view({'get': 'list', 'post': 'create'}), name='skills-create-list'),
    path('skills/<int:pk>/', views.SkillsViewSet.as_view({'get': 'retrieve','put': 'update','patch': 'partial_update','delete': 'destroy'}), name='skills-detail'),

    #ProfDocSetting
    path('docsettings/', views.DocSettingViewSet.as_view({'get': 'list', 'post': 'create'}), name='docsettings-create-list'),
    path('docsettings/<int:pk>/', views.DocSettingViewSet.as_view({'get': 'retrieve','put': 'update','patch': 'partial_update','delete': 'destroy'}), name='docsettings-detail'),


    #Documents
    path('document/', views.ProfDocumentViewSet.as_view({'get': 'list', 'post': 'create'}), name='document-create-list'),
    path('document/<int:pk>/', views.ProfDocumentViewSet.as_view({'get': 'retrieve','put': 'update','patch': 'partial_update','delete': 'destroy'}), name='document-detail'),

    #Events
    path('events/', views.EventViewSet.as_view({'get': 'list', 'post': 'create'}), name='events-create-list'),
    path('events/<int:pk>/', views.EventViewSet.as_view({'get': 'retrieve','put': 'update','patch': 'partial_update','delete': 'destroy'}), name='events-detail'),

    #Hours
    path('hours/', views.HoursViewSet.as_view({'get': 'list', 'post': 'create'}), name='hours-create-list'),
    path('hours/<int:pk>/', views.HoursViewSet.as_view({'get': 'retrieve','put': 'update','patch': 'partial_update','delete': 'destroy'}), name='hours-detail'),


    # dashboard
    path('ProfTotalCount/', views.ProfTotalCount.as_view(), name="ProfTotalCount"),
    path('ProfShifts/', views.ProfShifts.as_view(), name="ProfShifts"),
    path('ProfNotications/', views.ProfNotications.as_view(), name="ProfNotications"),
    path('ProfInvoices/', views.ProfInvoices.as_view(), name="ProfInvoices"),
    path('ProfWeeklyShifts/', views.ProfWeeklyShifts.as_view(), name="ProfWeeklyShifts"),
    path('ProfJobRequest/', views.ProfRecentRequest.as_view(), name="ProfJobRequest"),
    path('UpcomingShifts/', views.UpcomingShifts.as_view(), name="UpcomingShifts")

]