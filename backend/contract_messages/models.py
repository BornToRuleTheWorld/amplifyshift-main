from django.db import models
from model_utils.models import TimeStampedModel
from contract.models import Contract

# Create your models here.
class ContractMessages(TimeStampedModel):

    class MessageStatus(models.TextChoices):
        NEW = 'New', 'New'
        OPEN = 'Open', 'Open'
        DELETED = 'Deleted', 'Deleted'

    contract = models.ForeignKey(Contract, on_delete=models.CASCADE)
    message_from = models.IntegerField(null=True,blank=True)
    message_to = models.IntegerField(null=True,blank=True)
    message = models.TextField(null=True,blank=True)
    status = models.CharField(max_length=100,null=True,blank=True,choices=MessageStatus.choices)
    created_by = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return  self.status
    
    class Meta:
        verbose_name = "Contract Message"
        verbose_name_plural = "Contract Messages"
