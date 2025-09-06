from rest_framework import serializers
from .models import *
from django.utils.http import urlsafe_base64_decode
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth.models import User

class SlotSerializers(serializers.ModelSerializer):
    class Meta:
        model = Slots
        fields = "__all__"

class VerificationQASerializers(serializers.ModelSerializer):
    class Meta:
        model = UserVerificationQA
        fields = "__all__"

class SpecialitySerializers(serializers.ModelSerializer):
    class Meta:
        model = Speciality
        fields = "__all__"


class VisitTypeSerializers(serializers.ModelSerializer):
    class Meta:
        model = VisitType
        fields = "__all__"


class DocSoftSerializers(serializers.ModelSerializer):
    class Meta:
        model = DocSoftware
        fields = "__all__"


class JobTypeSerializers(serializers.ModelSerializer):
    class Meta:
        model = JobType
        fields = "__all__"


class WorkSettingSerializers(serializers.ModelSerializer):
    class Meta:
        model = WorkSetting
        fields = "__all__"


class WorkSettingExpSerializers(serializers.ModelSerializer):
    class Meta:
        model = WorkSettingExp
        fields = "__all__"


class LanguageSerializers(serializers.ModelSerializer):
    class Meta:
        model = Languages
        fields = "__all__"


class DisciplineSerializers(serializers.ModelSerializer):
    class Meta:
        model = Discipline
        fields = "__all__"


class StateSerializers(serializers.ModelSerializer):
    class Meta:
        model = State
        fields = "__all__"

class CountrySerializers(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = "__all__"

class ComSkillsSerializers(serializers.ModelSerializer):
    class Meta:
        model = ComputerSkills
        fields = "__all__"

class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

class SetNewPasswordSerializer(serializers.Serializer):
    password = serializers.CharField(write_only=True)
    uidb64 = serializers.CharField()
    token = serializers.CharField()

    def validate(self, data):
        try:
            uid = urlsafe_base64_decode(data['uidb64']).decode()
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            raise serializers.ValidationError("Invalid reset link.")

        if not default_token_generator.check_token(user, data['token']):
            raise serializers.ValidationError("Token is invalid or expired.")

        user.set_password(data['password'])
        user.save()

        return data
