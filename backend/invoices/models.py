from django.db import models
from contract.models import Contract, ContractHours
from model_utils.models import TimeStampedModel
from professional.models import Professional
from facility.models import Facility

# Create your models here.

# contract id
# Invoice Number
# Workhrs
# amount
# status Active , Inactive, Paid
# created on
# created by


class Invoices(TimeStampedModel):

    class InvoiceStatus(models.TextChoices):
        ACTIVE = "Active", "Active",
        INACTIVE = "Inactive", "Inactive"
        PAID = "Paid", "Paid"

    contract = models.ForeignKey(Contract, on_delete=models.CASCADE)
    invoice_no = models.CharField(max_length=100, null=True, blank=True)
    invoice_date = models.DateField(null=True, blank=True)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    total_wrk_hrs = models.IntegerField(null=True, blank=True)
    total_amount = models.IntegerField(null=True, blank=True)
    professional = models.ForeignKey(Professional, on_delete=models.CASCADE, null=True, blank=True)
    facility = models.ForeignKey(Facility, on_delete=models.CASCADE, null=True, blank=True)
    status = models.CharField(max_length=100, null=True, blank=True, choices=InvoiceStatus.choices, default=InvoiceStatus.ACTIVE)
    created_by = models.IntegerField(null=True, blank=True)

    class Meta:
        verbose_name = "Invoice"
        verbose_name_plural = "Invoices"


class InvoiceHours(TimeStampedModel):
    invoice = models.ForeignKey(Invoices, on_delete=models.CASCADE)
    contract_hours = models.ForeignKey(ContractHours, on_delete=models.CASCADE)

    class Meta:
        verbose_name = "Invoice Hour"
        verbose_name_plural = "Invoice Hours"