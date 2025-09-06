from rest_framework import serializers
from .models import *
from modules.models import *

class ProfessionalSerializers(serializers.ModelSerializer): 
    class Meta:
        model = Professional
        exclude = ['created', 'modified', 'prof_photo', 'prof_work_settings', 'prof_discipline', 'prof_langs', 'prof_doc_soft', 'prof_speciality' ]

    def validate_prof_years_in(self, value):
        if isinstance(value, dict):
            return value.get('value', '')
        return value

    def validate_prof_weekly_aval(self, value):
        if isinstance(value, dict):
            return value.get('value', '')
        return value


class ProfSlotSerializers(serializers.ModelSerializer):
    class Meta:
        model = ProfessionalSlots
        fields = "__all__"


class LicenseSerializers(serializers.ModelSerializer):
    class Meta:
        model = LicenseCertificate
        fields = "__all__"

class EducationSerializers(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = "__all__"

class CertificationSerializers(serializers.ModelSerializer):
    class Meta:
        model = Certifications
        fields = "__all__"


class ContactSerializers(serializers.ModelSerializer):
    class Meta:
        model = EmergencyContact
        fields = "__all__"


class ReferenceSerializers(serializers.ModelSerializer):
    class Meta:
        model = ProfessionalReferences
        fields = "__all__"


class VerifyQASerializers(serializers.ModelSerializer):
    class Meta:
        model = ProfessionalVerifyQA
        fields = "__all__"

class RefMailSerializers(serializers.ModelSerializer):
    class Meta:
        model = ReferenceMail
        fields = "__all__"

class HistorySerializers(serializers.ModelSerializer):
    class Meta:
        model  = EmployeeHistory
        fields = "__all__"


class SkillSerializers(serializers.ModelSerializer):
    
    computer_skills = serializers.PrimaryKeyRelatedField(queryset=ComputerSkills.objects.all(), many=True, required=False)
    
    class Meta:
        model  = ProfessionalSkills
        fields = "__all__"


class DocSettingSeraializers(serializers.ModelSerializer):
    class Meta:
        model = ProfessionalDocSetting
        fields = "__all__"


class ProfDocSeraializers(serializers.ModelSerializer):
    class Meta:
        model = ProfessionalDocuments
        fields = "__all__"


class ProfEventSeraializers(serializers.ModelSerializer):
    class Meta:
        model = ProfessionalEvents
        fields = "__all__"

class ProfHourSeraializers(serializers.ModelSerializer):
    class Meta:
        model = ProfessionalHours
        fields = "__all__"