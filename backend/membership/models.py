from django.db import models
from model_utils.models import TimeStampedModel

# Create your models here.
class MembershipPlan(TimeStampedModel):

    class UserType(models.TextChoices):
        PROFESSIONAL = "Professional", "Professional"
        FACILITY     = "Facility", "Facility"

    name          = models.CharField(max_length=100)
    description   = models.TextField()
    monthly_price = models.DecimalField(max_digits=12, decimal_places=2)
    yearly_price  = models.DecimalField(max_digits=12, decimal_places=2)
    is_popular    = models.BooleanField(null=True, blank=True)
    user_type     = models.CharField(max_length=100, null=True, blank=True, choices=UserType.choices)

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = "Membership Plan"
        verbose_name_plural = "Membership Plans"


class PlanFeatures(TimeStampedModel):
    membership = models.ForeignKey(MembershipPlan, on_delete=models.CASCADE)
    feature    = models.CharField(max_length=255)
    sort_order = models.IntegerField()

    def __str__(self):
        return self.feature
    
    class Meta:
        verbose_name = "Plan Feature"
        verbose_name_plural = "Plan Features"