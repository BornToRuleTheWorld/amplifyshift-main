from rest_framework import serializers
from .models import FacilityGroup, FacilityGroupLink

class FacilityGroupSerializers(serializers.ModelSerializer):
    class Meta:
        model = FacilityGroup
        exclude = ['id']


class FacilityLinkSerializers(serializers.ModelSerializer):
    class Meta:
        model = FacilityGroupLink
        exclude = ['id']