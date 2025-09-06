from django.db import models
from jobs.models import Jobs, JobWorkHours, JobHours
from job_request.models import JobProfessionalRequest
from model_utils.models import TimeStampedModel
from professional.models import ProfessionalSlots, ProfessionalHours
import random
import string
# Create your models here.
class Contract(TimeStampedModel):

    class ContractStatus(models.TextChoices):
        NEW = "New", "New"

    contract_no = models.CharField(max_length=100, null=True, blank=True)
    job = models.ForeignKey(Jobs, on_delete=models.CASCADE)
    job_request = models.ForeignKey(JobProfessionalRequest, on_delete=models.CASCADE)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=100, null=True, blank=True, choices=ContractStatus.choices, default=ContractStatus.NEW)
    created_by = models.IntegerField(null=True, blank=True)
    last_updated_by = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return f"{self.start_date}--{self.end_date}"
    
    def generate_contract_no(self):
        while True:
            random_no = ''.join(random.choices(string.digits, k=8))
            if not Contract.objects.filter(contract_no=random_no).exists():
                return random_no

    def save(self, *args, **kwargs):
        if not self.contract_no:
            self.contract_no = self.generate_contract_no()
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = "Contract"
        verbose_name_plural = "Contracts"


class ContractHours(TimeStampedModel):

    class HourStatus(models.TextChoices):
        ACTIVE = "Active", "Active"
        INACTIVE = "Inactive", "Inactive"
        CANCELLED = "Cancelled", "Cancelled"
        COMPLETED = "Completed", "Completed"
        INVOICED  = "Invoiced", "Invoiced"
        
    class UserType(models.TextChoices):
        PROFESSIONAL = "Professional", "Professional"
        FACILITY     =  "Facility", "Facility"
        NONE         =  "None", "None"

    contract = models.ForeignKey(Contract, on_delete=models.CASCADE)
    job_work_hours = models.ForeignKey(JobWorkHours, on_delete=models.CASCADE, null=True, blank=True)
    professional_slots = models.ForeignKey(ProfessionalSlots, on_delete=models.CASCADE, null=True, blank=True)
    status = models.CharField(max_length=100, null=True, blank=True, choices=HourStatus.choices, default=HourStatus.ACTIVE)
    cancel_user_type = models.CharField(max_length=100, null=True, blank=True, choices=UserType.choices, default=UserType.NONE)
    cancelled_on = models.DateField(null=True, blank=True)

    def __str__(self):
        return str(self.contract)

    class Meta:
        verbose_name = "Contract Hour"
        verbose_name_plural = "Contract Hours"


class ContractWorkHours(TimeStampedModel):

    class HourStatus(models.TextChoices):
        ACTIVE = "Active", "Active"
        INACTIVE = "Inactive", "Inactive"
        CANCELLED = "Cancelled", "Cancelled"
    
    class UserType(models.TextChoices):
        PROFESSIONAL = "Professional", "Professional"
        FACILITY     =  "Facility", "Facility"
        NONE         =  "None", "None"

    contract = models.ForeignKey(Contract, on_delete=models.CASCADE)
    job_hours = models.ForeignKey(JobHours, on_delete=models.CASCADE)
    professional_hours = models.ForeignKey(ProfessionalHours, on_delete=models.CASCADE)
    status = models.CharField(max_length=100, null=True, blank=True, choices=HourStatus.choices, default=HourStatus.ACTIVE)
    cancel_user_type = models.CharField(max_length=100, null=True, blank=True, choices=UserType.choices, default=UserType.NONE)
    cancelled_on = models.DateField(null=True, blank=True)

    def __str__(self):
        return str(self.contract)

    class Meta:
        verbose_name = "Contract Work Hour"
        verbose_name_plural = "Contract Work Hours"