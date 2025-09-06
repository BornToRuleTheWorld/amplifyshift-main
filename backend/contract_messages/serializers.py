from rest_framework import serializers
from .models import ContractMessages

class ContractMessageSerailaizers(serializers.ModelSerializer):
    class Meta:
        model = ContractMessages
        fields = "__all__"