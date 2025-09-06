from django.db import models
from auditlog.registry import auditlog
from model_utils.models import TimeStampedModel
from jobs.models import Jobs
from professional.models import Professional
# Create your models here.

#-------jobs_professional_request-----#
# id
# job_id
# professional_id
# status   New , Open , In Process , Booked , Rejected , Deleted
# last updated on
# created on
# created_by


class JobProfessionalRequest(TimeStampedModel):
    class Status(models.TextChoices):
        NEW = 'New', 'New'
        OPEN = 'Open', 'Open'
        INTERESTED = 'Interested', 'Interested' 
        NOT_INTERESTED = 'Not Interested', 'Not Interested'
        IN_PROCESS = 'In Process','In Process'
        REJECTED  = 'Rejected', 'Rejected'
        CONFIRMED = 'Confirmed', 'Confirmed'
        DELETED = 'Deleted', 'Deleted'
        CONTRACT_CREATED = 'Contract Created', 'Contract Created'

    job = models.ForeignKey(Jobs,on_delete=models.CASCADE)
    professional = models.ForeignKey(Professional, on_delete=models.CASCADE)
    status = models.CharField(max_length=100,choices=Status.choices,default=Status.NEW,null=True,blank=True)
    created_by = models.CharField(max_length=100,null=True,blank=True)


    def __str__(self):
        return  self.status
    
    class Meta:
        verbose_name = "Job Professional Request"
        verbose_name_plural = "Job Professional Requests"


auditlog.register(JobProfessionalRequest)