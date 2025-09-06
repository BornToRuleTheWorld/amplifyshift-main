from django.db import models
from model_utils.models import TimeStampedModel
from facility.models import Facility
from modules.models import Discipline, Speciality, WorkSetting, Languages, JobType, VisitType
from modules.models import Slots
# Create your models here.

#-----jobs------#

# id
# facility_id
# dicipline
# years of exp
# specialty
# licence
# work setting
# job type
# language
# calendar
# pay
# cpr, bls
# type of visit
# contact_person
# address1
# address2
# city
# state
# country
# zipcode
# created_by

class Jobs(TimeStampedModel):

    class StaticChoices(models.TextChoices):
        YES = 'yes', 'yes'
        NO  = 'no', 'no'
    
    class Status(models.TextChoices):
        INACTIVE = 'Inactive', 'Inactive'
        ACTIVE = 'Active', 'Active'
        OPEN = 'open', 'open'
        CLOSED  = 'closed', 'closed'
        DELETED = 'deleted', 'deleted'
        
    job_title = models.CharField(max_length=255,null=True,blank=True)
    facility = models.ForeignKey(Facility,on_delete=models.CASCADE)
    discipline = models.ForeignKey(Discipline,on_delete=models.CASCADE,null=True,blank=True)
    speciality = models.ForeignKey(Speciality,on_delete=models.CASCADE,null=True,blank=True)
    work_setting = models.ForeignKey(WorkSetting,on_delete=models.CASCADE,null=True,blank=True)
    job_type = models.ForeignKey(JobType,on_delete=models.CASCADE,null=True,blank=True)
    languages = models.ForeignKey(Languages,on_delete=models.CASCADE,null=True,blank=True)
    visit_type = models.ForeignKey(VisitType,on_delete=models.CASCADE,null=True,blank=True)
    years_of_exp = models.CharField(max_length=100, null=True, blank=True)
    license = models.CharField(max_length=100, null=True, blank=True)
    pay = models.DecimalField(max_digits=12,decimal_places=2,null=True,blank=True)
    cpr_bls = models.CharField(max_length=3,null=True,blank=True,choices=StaticChoices.choices, default=StaticChoices.NO)
    contact_person = models.CharField(max_length=100,null=True,blank=True)
    address1 = models.TextField(null=True,blank=True)
    address2 = models.TextField(null=True,blank=True)
    city = models.CharField(max_length=100,null=True,blank=True)
    state = models.CharField(max_length=100,null=True,blank=True)
    country = models.CharField(max_length=100,null=True,blank=True)
    zipcode = models.CharField(max_length=100,null=True,blank=True)
    contact_phone = models.CharField(max_length=100,null=True, blank=True)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=100, null=True, blank=True, choices=Status.choices, default=Status.INACTIVE)
    created_by = models.IntegerField(null=True,blank=True)

    def __str__(self):
        return  f"{self.job_title} -&- {self.facility.fac_first_name}"
    
    class Meta:
        verbose_name = "Job"
        verbose_name_plural = "Jobs"


class JobWorkHours(TimeStampedModel):

    class Status(models.TextChoices):
        AVAILABLE = "Available", "Available"
        BOOKED    = "Booked", "Booked"
        CANCELLED = "Cancelled", "Cancelled"
        DELETED   = "Deleted", "Deleted"
    
    job = models.ForeignKey(Jobs,on_delete=models.CASCADE)
    slot = models.ForeignKey(Slots, on_delete=models.CASCADE)
    date = models.DateField(null=True, blank=True)
    status   = models.CharField(max_length=100, choices=Status.choices, default=Status.AVAILABLE)

    def __str__(self):
        return str(self.date)

    class Meta:
        verbose_name = "Job Work Hour"
        verbose_name_plural = "Job Work Hours"


class JobHours(TimeStampedModel):

    class Status(models.TextChoices):
        AVAILABLE = "Available", "Available"
        BOOKED    = "Booked", "Booked"
        CANCELLED = "Cancelled", "Cancelled"
        DELETED   = "Deleted", "Deleted"

    facility = models.ForeignKey(Facility, on_delete=models.CASCADE)
    job      = models.ForeignKey(Jobs, on_delete=models.CASCADE)
    date     = models.DateField(null=True, blank=True)
    hours    = models.IntegerField(null=True, blank=True)
    status   = models.CharField(max_length=100, choices=Status.choices, default=Status.AVAILABLE)

    def __str__(self):
        return self.facility.fac_first_name

    class Meta:
        verbose_name        = "Job hour"
        verbose_name_plural = "Job hours"