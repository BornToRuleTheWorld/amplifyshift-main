from django.db import models
from model_utils.models import TimeStampedModel
from job_request.models import JobProfessionalRequest

# Create your models here.

# jobs_professional_request_messages

# id
# jobs_professional_request_id
# message_from  ( userid )
# message_to ( userid )
# message
# status   New , Open, Deleted
# created_on
# created_by

class JobProfessionalRequestMessages(TimeStampedModel):

    class MessageStatus(models.TextChoices):
        NEW = 'New', 'New'
        OPEN = 'Open', 'Open'
        DELETED = 'Deleted', 'Deleted'

    job_request = models.ForeignKey(JobProfessionalRequest, on_delete=models.CASCADE)
    message_from = models.IntegerField(null=True,blank=True)
    message_to = models.IntegerField(null=True,blank=True)
    message = models.TextField(null=True,blank=True)
    status = models.CharField(max_length=100,null=True,blank=True,choices=MessageStatus.choices)
    created_by = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return  self.status
    
    class Meta:
        verbose_name = "Job Professional Request Message"
        verbose_name_plural = "Job Professional Request Messages"