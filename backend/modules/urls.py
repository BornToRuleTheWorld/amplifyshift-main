from django.contrib import admin
from django.urls import path
from modules import views


urlpatterns = [
    path('GenerateUserOrLink/',views.GenerateUserOrLink.as_view(),name="GenerateUserOrLink"),
    path('ChangePassword/',views.ChangePassword.as_view(),name='ChangePassword'),

    path('CreateVerifyUser/',views.CreateVerifyUser.as_view(),name="CreateVerifyUser"),
    path('VerifyActiveUser/',views.VerifyUser.as_view(),name="VerifyActiveUser"),
    path('VerifyLogin/',views.VerifyLogin.as_view(),name="VerifyLogin"),

    path('ForgotPassword/', views.ForgotPasswordView.as_view(), name='forgot-password'),
    path('PasswordResetConfirm/<uidb64>/<token>/', views.ResetPasswordConfirmView.as_view(), name='password-reset-confirm'),
    
    path('GetModules/',views.GetModules.as_view(),name="GetModules"),
    path('ValidateEmail/',views.ValidateEmail.as_view(), name="ValidateEmail"),
    
    path('GetSlots/',views.GetSlots.as_view(),name='GetSlots'),
    path('GetSlot/',views.GetSlot.as_view(),name='GetSlot'),

    # Documentation Software
    path('DocSoft/', views.DocSoftViewSet.as_view({'get': 'list', 'post': 'create'}), name='DocSoft'),
    path('DocSoft/<int:pk>/', views.DocSoftViewSet.as_view({'get': 'retrieve','put': 'update','patch': 'partial_update','delete': 'destroy'}), name='DocSoftOther'),

    # Language
    path('Language/', views.LanguageViewSet.as_view({'get': 'list', 'post': 'create'}), name='Language'),
    path('Language/<int:pk>/', views.LanguageViewSet.as_view({'get': 'retrieve','put': 'update','patch': 'partial_update','delete': 'destroy'}), name='LanguageOther'),


    path('test-mail/',views.test_mail,name='test-mail'),


]