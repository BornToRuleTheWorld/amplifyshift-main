from django.db import models
from model_utils.models import TimeStampedModel
from modules.models import Languages, Discipline, DocSoftware, Speciality,WorkSettingExp,WorkSetting,JobType,VisitType
from django.contrib.auth.models import User

# Create your models here.
class Facility(TimeStampedModel):

    class FacStatus(models.TextChoices):
        CONFIRMATION = "Waiting for Confirmation", "Waiting for Confirmation"
        ACTIVE   = "Active", "Active"
        INACTIVE = "Inactive", "Inactive"
    
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    fac_title  = models.CharField(max_length=100,null=True,blank=True)
    fac_business_name = models.CharField(max_length=100,null=True,blank=True)
    fac_first_name = models.CharField(max_length=100,null=True,blank=True)
    fac_middle_name = models.CharField(max_length=100,null=True,blank=True)
    fac_last_name = models.CharField(max_length=100,null=True,blank=True)
    fac_email = models.EmailField(null=True,blank=True)
    fac_address = models.CharField(max_length=255,null=True,blank=True)
    fac_address_2 = models.CharField(max_length=255,null=True,blank=True)
    fac_city = models.CharField(max_length=100,null=True,blank=True)
    fac_state = models.IntegerField(null=True,blank=True)
    fac_cntry = models.IntegerField(null=True,blank=True)
    fac_zipcode = models.CharField(max_length=100,null=True,blank=True)
    fac_contact_num = models.CharField(max_length=100,null=True,blank=True)
    fac_ein_number =  models.IntegerField(null=True,blank=True)
    fac_wrk_exp = models.CharField(max_length=100,null=True,blank=True)
    fac_weekly_visit = models.CharField(max_length=100,null=True,blank=True)
    fac_npi = models.CharField(max_length=100,null=True,blank=True)
    fac_wrk_setting = models.ManyToManyField(WorkSettingExp)
    fac_discipline = models.ManyToManyField(Discipline)
    fac_speciality = models.ManyToManyField(Speciality)
    fac_langs = models.ManyToManyField(Languages)
    fac_doc_soft = models.ManyToManyField(DocSoftware)
    fac_e_sign = models.FileField(upload_to ='uploads/facility/e-sign',null=True,blank=True)
    fac_activated_on = models.DateTimeField(null=True,blank=True)
    fac_status = models.CharField(max_length=100,null=True,blank=True, choices=FacStatus.choices, default=FacStatus.INACTIVE)
    fac_logo = models.FileField(upload_to ='uploads/facility/logo',null=True,blank=True)

    def __str__(self):
        return self.fac_first_name
    
    # get all languages of a particular facloyee
    def get_fac_languages(self):
        return self.fac_langs.all()
    
    # get all disciplines of a particular facloyee
    def get_fac_disciplines(self):
        return self.fac_discipline.all()
    
    # get all documentation softwares of a particular facloyee
    def get_fac_doc_softwares(self):
        return self.fac_doc_soft.all()
    
    # get all specialities of a particular facloyee
    def get_fac_specialities(self):
        return self.fac_speciality.all()
    
     # get all work settings of a particular facloyee
    def get_fac_work_settings(self):
        return self.fac_wrk_setting.all()
    
    class Meta:
        verbose_name = "Facility"
        verbose_name_plural = "Facilities"



class VisitSearch(TimeStampedModel):
    
    class StaticChoices(models.TextChoices):
        YES = 'yes', 'yes'
        NO  = 'no', 'no'
    
    facility_id = models.IntegerField(null=True,blank=True,default=0)
    zipcode = models.CharField(max_length=100, null=True, blank=True)
    years_of_exp = models.CharField(max_length=100, null=True, blank=True)
    # discipline = models.ForeignKey(Discipline,on_delete=models.CASCADE, null=True, blank=True)
    # speciality = models.ForeignKey(Speciality,on_delete=models.CASCADE, null=True, blank=True)
    # work_setting = models.ForeignKey(WorkSetting,on_delete=models.CASCADE, null=True, blank=True)
    # job_type = models.ForeignKey(JobType,on_delete=models.CASCADE, null=True, blank=True)
    # languages = models.ForeignKey(Languages,on_delete=models.CASCADE, null=True, blank=True)
    # visit_type = models.ForeignKey(VisitType,on_delete=models.CASCADE, null=True, blank=True)
    discipline = models.ManyToManyField(Discipline)
    speciality = models.ManyToManyField(Speciality)
    work_setting = models.ManyToManyField(WorkSetting)
    job_type = models.ManyToManyField(JobType)
    languages = models.ManyToManyField(Languages)
    visit_type = models.ManyToManyField(VisitType)
    dates = models.JSONField(null=True, blank=True, default=dict)
    result_count = models.IntegerField(null=True,blank=True,default=0)
    professional_ids = models.JSONField(null=True, blank=True, default=dict)
    pay = models.DecimalField(max_digits=12,decimal_places=2,null=True,blank=True)
    license = models.CharField(max_length=100,null=True,blank=True,choices=StaticChoices.choices, default=StaticChoices.NO)
    cpr_bls = models.CharField(max_length=100,null=True,blank=True,choices=StaticChoices.choices, default=StaticChoices.NO)

    def __str__(self):
        return str(self.result_count)

    class Meta:
        verbose_name = "Visit search"
        verbose_name_plural = "Visit searches"


class FacilityPreference(TimeStampedModel):

    class StaticChoices(models.TextChoices):
        YES = 'yes', 'yes'
        NO  = 'no', 'no'

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    facility = models.ForeignKey(Facility, on_delete=models.CASCADE)
    discipline = models.ForeignKey(Discipline,on_delete=models.CASCADE,null=True,blank=True)
    speciality = models.ForeignKey(Speciality,on_delete=models.CASCADE,null=True,blank=True)
    work_setting = models.ForeignKey(WorkSetting,on_delete=models.CASCADE,null=True,blank=True)
    job_type = models.ForeignKey(JobType,on_delete=models.CASCADE,null=True,blank=True)
    languages = models.ForeignKey(Languages,on_delete=models.CASCADE,null=True,blank=True)
    visit_type = models.ForeignKey(VisitType,on_delete=models.CASCADE,null=True,blank=True)
    years_of_exp = models.CharField(max_length=100, null=True, blank=True)
    cpr_bls = models.CharField(max_length=3,null=True,blank=True, choices=StaticChoices.choices, default=StaticChoices.NO)
    license = models.CharField(max_length=100, null=True, blank=True, choices=StaticChoices.choices, default=StaticChoices.NO)
    pay = models.DecimalField(max_digits=12,decimal_places=2,null=True,blank=True)

    def __str__(self):
        return f"{self.facility.fac_first_name} {self.facility.fac_last_name}"
    

class FacilityDocSetting(TimeStampedModel):

    class Status(models.TextChoices):
        YES = 'Yes', 'Yes'
        NO = 'No', 'No'

    facility     = models.ForeignKey(Facility, on_delete=models.CASCADE, null=True, blank=True)
    discipline   = models.ManyToManyField(Discipline)
    setting_name = models.CharField(max_length=255, null=True, blank=True)
    is_expired   = models.BooleanField(null=True, blank=True)
    status       = models.CharField(max_length=100, null=True, blank=True,choices=Status.choices)

    def __str__(self):
        return self.setting_name
    
    class Meta:
        verbose_name        = "Facility DocSetting"
        verbose_name_plural = "Facility DocSettings"



