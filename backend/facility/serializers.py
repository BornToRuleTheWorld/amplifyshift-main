from rest_framework import serializers
from .models import Facility,VisitSearch, FacilityPreference, FacilityDocSetting
from modules.models import *
from rest_framework.validators import UniqueTogetherValidator

class FacilitySerializers(serializers.ModelSerializer):
    class Meta:
        model = Facility
        exclude = ['fac_logo', 'fac_wrk_setting', 'fac_discipline', 'fac_langs', 'fac_doc_soft', 'fac_speciality']

class FacilitySearchSerializers(serializers.ModelSerializer):
    discipline = serializers.PrimaryKeyRelatedField(queryset=Discipline.objects.all(), many=True, required=False)
    speciality = serializers.PrimaryKeyRelatedField(queryset=Speciality.objects.all(), many=True, required=False)
    work_setting = serializers.PrimaryKeyRelatedField(queryset=WorkSetting.objects.all(), many=True, required=False)
    job_type = serializers.PrimaryKeyRelatedField(queryset=JobType.objects.all(), many=True, required=False)
    languages = serializers.PrimaryKeyRelatedField(queryset=Languages.objects.all(), many=True, required=False)
    visit_type = serializers.PrimaryKeyRelatedField(queryset=VisitType.objects.all(), many=True, required=False)

    class Meta:
        model = VisitSearch
        fields = '__all__'


class PreferenceSerializers(serializers.ModelSerializer):
    class Meta:
        model = FacilityPreference
        fields = '__all__'
        validators = [
            UniqueTogetherValidator(
                queryset=FacilityPreference.objects.all(),
                fields=['user', 'discipline'],
                message="This discipline preference already exists for this user."
            )
        ]


class FacDocSerializers(serializers.ModelSerializer):
    class Meta:
        model  = FacilityDocSetting
        fields = '__all__'