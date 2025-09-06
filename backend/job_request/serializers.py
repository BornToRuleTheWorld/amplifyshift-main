from rest_framework import serializers
from .models import JobProfessionalRequest

class JobRequestSerializers(serializers.ModelSerializer):
    class Meta:
        model = JobProfessionalRequest
        fields = "__all__"