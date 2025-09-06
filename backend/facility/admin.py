from django.contrib import admin
from .models import Facility,VisitSearch,FacilityPreference
# Register your models here.

admin.site.register(Facility)
admin.site.register(VisitSearch)
admin.site.register(FacilityPreference)