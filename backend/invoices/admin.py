from django.contrib import admin
from .models import InvoiceHours, Invoices
# Register your models here.

admin.site.register(Invoices)
admin.site.register(InvoiceHours)
