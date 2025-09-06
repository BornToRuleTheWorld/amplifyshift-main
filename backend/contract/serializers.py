from rest_framework import serializers
from .models import Contract, ContractHours, ContractWorkHours


class ContractSerializers(serializers.ModelSerializer):
    class Meta:
        model = Contract
        fields = "__all__"

class ContractHoursSerializers(serializers.ModelSerializer):
    class Meta:
        model = ContractHours
        fields = "__all__"

class ContractWorkHoursSerializers(serializers.ModelSerializer):
    class Meta:
        model = ContractWorkHours
        fields = "__all__"