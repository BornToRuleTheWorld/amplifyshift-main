from rest_framework import serializers
from .models import MembershipPlan,PlanFeatures

class MemberShipSerializers(serializers.ModelSerializer):
    class Meta:
        model = MembershipPlan
        fields = "__all__"

class FeatureSerializers(serializers.ModelSerializer):
    class Meta:
        model = PlanFeatures
        fields = "__all__"