from rest_framework import serializers
from .models import *

class JobSerializers(serializers.ModelSerializer):
    class Meta:
        model = Jobs
        fields = "__all__"

class WorkHoursSerializers(serializers.ModelSerializer):
    class Meta:
        model = JobWorkHours
        fields = "__all__"


class HourSerializers(serializers.ModelSerializer):
    class Meta:
        model = JobHours
        fields = "__all__"