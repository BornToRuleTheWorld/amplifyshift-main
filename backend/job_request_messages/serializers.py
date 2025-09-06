from rest_framework import serializers
from .models import JobProfessionalRequestMessages

class MessageSerailaizers(serializers.ModelSerializer):
    class Meta:
        model = JobProfessionalRequestMessages
        fields = "__all__"