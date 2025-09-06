from django.db import models
from model_utils.models import TimeStampedModel
from colorfield.fields import ColorField

# Create your models here.
class Categories(TimeStampedModel):
    cat_name = models.CharField(max_length=100,null=True,blank=True)

    def __str__(self) -> str:
        return self.cat_name
    
    class Meta:
        verbose_name = "Category"
        verbose_name_plural = "Categories"

class Speciality(TimeStampedModel):
    spl_name = models.CharField(max_length=100,null=True,blank=True)
    category = models.ForeignKey(Categories,on_delete=models.CASCADE)
    
    def __str__(self) -> str:
        return self.spl_name
    
    # return all the staff for specific speciality 
    def get_speciality_staffs(self):
        return self.staff_set.all()
    
    def get_category(self):
        return self.category.cat_name

    class Meta:
        verbose_name = "Speciality"
        verbose_name_plural = "Specialities"


class DocSoftware(TimeStampedModel):
    doc_soft_name = models.CharField(max_length=100,null=True,blank=True)
    category = models.ForeignKey(Categories,on_delete=models.CASCADE)

    def __str__(self) -> str:
        return self.doc_soft_name
    
    # return all the staff for specific DocSoftware
    def get_docsoft_staffs(self):
        return self.staff_set.all()
    
    def get_category(self):
        return self.category.cat_name
    
    class Meta:
        verbose_name = "DocSoftware"
        verbose_name_plural = "DocSoftwares"
        
    
class Discipline(TimeStampedModel):

    class Status(models.TextChoices):
        ACTIVE = "Active", "Active"
        INACTIVE = "Inactive", "Inactive"

    disp_name = models.CharField(max_length=100,null=True,blank=True)
    color_code = ColorField()
    status = models.CharField(max_length=100,null=True,blank=True, choices=Status.choices)
    category = models.ForeignKey(Categories,on_delete=models.CASCADE)

    def __str__(self) -> str:
        return self.disp_name
    
    # return all the staff for specific Discipline
    def get_discipline_staffs(self):
        return self.staff_set.all()
    
    def get_category(self):
        return self.category.cat_name
    
    class Meta:
        verbose_name = "Discipline"
        verbose_name_plural = "Disciplines"

class Languages(TimeStampedModel):
    lang_name = models.CharField(max_length=100,null=True,blank=True)
    category = models.ForeignKey(Categories,on_delete=models.CASCADE)

    def __str__(self) -> str:
        return self.lang_name
    
    # return all the staff for specific Languages
    def get_language_staffs(self):
        return self.staff_set.all()
    
    def get_category(self):
        return self.category.cat_name

    class Meta:
        verbose_name = "Language"
        verbose_name_plural = "Languages" 
    

class WorkSettingExp(TimeStampedModel):
    wkr_name = models.CharField(max_length=100,null=True,blank=True)
    category = models.ForeignKey(Categories,on_delete=models.CASCADE)

    def __str__(self) -> str:
        return self.wkr_name
    
    # return all the staff for specific Languages
    def get_language_staffs(self):
        return self.staff_set.all()
    
    def get_category(self):
        return self.category.cat_name
    
    class Meta:
        verbose_name = "Work Setting Experience"
        verbose_name_plural = "Work Setting Experiences" 


class Slots(TimeStampedModel):

    class TypeChoices(models.TextChoices):
        SLOTS = 'Slots', 'Slots'
        HOUR_SLOTS = 'Hour_slots', 'Hour_slots'

    start_hr = models.TimeField()
    end_hr = models.TimeField()
    slot_type = models.CharField(max_length=100, null=True, blank=True, choices=TypeChoices.choices, default=TypeChoices.SLOTS)

    def __str__(self):
        return f"{self.start_hr} - {self.end_hr}"
    
    class Meta:
        verbose_name = "Slot"
        verbose_name_plural = "Slots" 


class WorkSetting(TimeStampedModel):
    wrk_set_name = models.CharField(max_length=100,null=True,blank=True)
    category = models.ForeignKey(Categories,on_delete=models.CASCADE)


    def __str__(self):
        return self.wrk_set_name
    
    class Meta:
        verbose_name = "Work setting"
        verbose_name_plural = "Work settings"


class JobType(TimeStampedModel):
    type_name = models.CharField(max_length=100,null=True,blank=True)
    category = models.ForeignKey(Categories,on_delete=models.CASCADE)

    def __str__(self):
        return self.type_name
    
    class Meta:
        verbose_name = "Job type"
        verbose_name_plural = "Job types"


class VisitType(TimeStampedModel):
    visit_name = models.CharField(max_length=100,null=True,blank=True)
    category = models.ForeignKey(Categories,on_delete=models.CASCADE)

    def __str__(self):
        return self.visit_name
    
    class Meta:
        verbose_name = "Visit type"
        verbose_name_plural = "Visit types"


class UserVerificationQA(TimeStampedModel):
    question = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return self.question

    class Meta:
        verbose_name = "User Verification QA"
        verbose_name_plural = "User Verification QAs"


class Country(TimeStampedModel):
    cntry_name = models.CharField(max_length=100, null=True, blank=True)
    cntry_code = models.CharField(max_length=100, null=True, blank=True)
    is_visible = models.IntegerField(null=True, blank=True, default=1)

    def __str__(self):
        return self.cntry_name
    
    class Meta:
        verbose_name = "Country"
        verbose_name_plural = "Countries"


class State(TimeStampedModel):
    country = models.ForeignKey(Country, on_delete=models.CASCADE)
    state_name = models.CharField(max_length=100, null=True, blank=True)
    state_code = models.CharField(max_length=100, null=True, blank=True)
    is_visible = models.IntegerField(null=True, blank=True, default=1)

    def __str__(self):
        return self.state_name
    
    class Meta:
        verbose_name = "State"
        verbose_name_plural = "States"


class ComputerSkills(TimeStampedModel):
    skill_name = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return self.skill_name
    
    class Meta:
        verbose_name = "Computer Skill"
        verbose_name_plural = "Computer Skills"