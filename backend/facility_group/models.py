from django.db import models
from model_utils.models import TimeStampedModel
from django.contrib.auth.models import User

# Create your models here.
class FacilityGroup(TimeStampedModel):
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    fac_grp_email = models.EmailField(null=True,blank=True)
    fac_grp_first_name = models.CharField(max_length=100,null=True,blank=True)
    fac_grp_middle_name = models.CharField(max_length=100,null=True,blank=True)
    fac_grp_last_name = models.CharField(max_length=100,null=True,blank=True)
    fac_grp_address = models.CharField(max_length=255,null=True,blank=True)
    fac_grp_address2 = models.CharField(max_length=255,null=True,blank=True)
    fac_grp_city = models.CharField(max_length=100,null=True,blank=True)
    fac_grp_state = models.IntegerField(null=True,blank=True)
    fac_grp_cntry = models.IntegerField(null=True,blank=True)
    fac_grp_zipcode = models.CharField(max_length=100,null=True,blank=True)
    fac_grp_contact = models.CharField(max_length=100,null=True,blank=True)
    
    def __str__(self):
        return self.fac_grp_first_name
    
    class Meta:
        verbose_name = "Facility Group"
        verbose_name_plural = "Facility Groups"
    

class FacilityGroupLink(TimeStampedModel):
    fac_id = models.IntegerField(null=True,blank=True)
    fac_grp_id = models.IntegerField(null=True,blank=True)

    def __str__(self):
        return str(self.fac_id)
    
    class Meta:
        verbose_name = "Facility Group Link"
        verbose_name_plural = "Facility Group Links"