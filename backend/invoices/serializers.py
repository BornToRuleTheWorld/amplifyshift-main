from rest_framework import serializers
from .models import *

class InvoiceSerializers(serializers.ModelSerializer): 
    class Meta:
        model = Invoices
        fields = "__all__"

class InvoiceHourSerializers(serializers.ModelSerializer): 
    class Meta:
        model = InvoiceHours
        fields = "__all__"