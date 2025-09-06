from django.db import models
from model_utils.models import TimeStampedModel
from datetime import datetime
from modules.models import Languages, Discipline, DocSoftware, Speciality, WorkSettingExp, Slots, UserVerificationQA, State, Country, ComputerSkills
from django.contrib.auth.models import User

# Create your models here.

# name - char
# address - char
# contact - char
# ein_number - int
# work_exp - char
# discipline - char
# years_in - char
# speciality - char
# documentation -char
# state_code - char
# zip_primary - char
# zip_secondary - char
# langugaes - char
# weekly_availablity - char
# license - char
# lic_state_code - char
# hr_lic_cerfication - char
# hr_tb_physical_form - char
# hr_edu_history - char
# hr_cert - char
# hr_prof_ref - char
# hr_emergency_contact - char
# hr_pl_insurance - int


# DOCUMENTATION_SOFTWARE = (
#     ('Net Health/Rehab Optima','Net Health/Rehab Optima'),
#     ('Axxess','Axxess'),
#     ('Kinnser','Kinnser'),
#     ('WebPT','WebPT'),
#     ('Other','Other'),
#     ('None','None')
# )

# LANGUAGES = (
#     ('English','English'),
#     ('Spanish','Spanish'),
#     ('French','French'),
#     ('Hindi','Hindi'),
#     ('Others','Others')
# )

# DISCIPLINE = (
#     ('PT','PT'),
#     ('PTA','PTA'),
#     ('OT','OT'),
#     ('COTA','COTA'),
#     ('SLP','SLP'),
#     ('None','None')
# )

#    SPECIALITY = (
#         ('Geriatrics','Geriatrics'),
#         ('Peadiatrics','Peadiatrics'),
#         ('Sports Rehab','Sports Rehab'),
#         ('Pelvic Floor Rehab','Pelvic Floor Rehab'),
#         ('Orthopedics','Orthopedics'),
#         ('Neuro','Neuro'),
#         ('General','General'),
#         ('None','None')
#     )

class Professional(TimeStampedModel):

    class ProfStatus(models.TextChoices):
        CONFIRMATION = "Waiting for Confirmation", "Waiting for Confirmation" 
        APPROVAL = "Waiting for Referral Approval", "Waiting for Referral Approval"
        ACTIVE = "Active", "Active"
        INACTIVE = "Inactive", "Inactive"

    class ProfRefStatus(models.TextChoices):
        NEW   = "New", "New"
        OPEN  = "Open", "Open"
        CLOSED = "Closed", "Closed"
    
    class ProfLicStatus(models.TextChoices):
        ACTIVE = "Active", "Active"
        INACTIVE = "Inactive", "Inactive"

    user = models.ForeignKey(User,on_delete=models.CASCADE)
    prof_first_name = models.CharField(max_length=100,null=True,blank=True)
    prof_last_name = models.CharField(max_length=100,null=True,blank=True)
    prof_middle_name = models.CharField(max_length=100,null=True,blank=True)
    prof_email = models.CharField(max_length=100,null=True,blank=True)
    prof_address = models.CharField(max_length=255,null=True,blank=True)
    prof_address_2 = models.CharField(max_length=255,null=True,blank=True)
    prof_city = models.CharField(max_length=255,null=True,blank=True)
    prof_state = models.IntegerField(null=True, blank=True)
    prof_cntry = models.IntegerField(null=True, blank=True)
    prof_contact = models.CharField(max_length=255,null=True,blank=True)
    prof_ein_number = models.IntegerField(null=True,blank=True)
    prof_years_in = models.CharField(max_length=100,null=True,blank=True)
    prof_zip_primary = models.CharField(max_length=100,null=True,blank=True)
    prof_zip_secondary = models.CharField(max_length=100,null=True,blank=True)
    prof_weekly_aval = models.CharField(max_length=255,null=True,blank=True)
    prof_license = models.CharField(max_length=255,null=True,blank=True)
    prof_lic_state = models.CharField(max_length=100,null=True,blank=True)
    prof_npi = models.CharField(max_length=100,null=True,blank=True)
    prof_status = models.CharField(max_length=100,null=True,blank=True, choices=ProfStatus.choices)
    prof_activated_on = models.DateTimeField(null=True,blank=True)
    prof_ref_verify = models.CharField(max_length=100, null=True, blank=True, choices=ProfRefStatus.choices)
    prof_ref_verified_on = models.DateTimeField(null=True, blank=True)
    prof_work_settings = models.ManyToManyField(WorkSettingExp)
    prof_discipline = models.ManyToManyField(Discipline)
    prof_langs = models.ManyToManyField(Languages)
    prof_doc_soft = models.ManyToManyField(DocSoftware)
    prof_speciality = models.ManyToManyField(Speciality)
    prof_photo = models.FileField(upload_to ='uploads/professional/photo',null=True,blank=True)
    prof_lic_issued = models.DateField(null=True, blank=True)
    prof_lic_expired = models.DateField(null=True, blank=True)
    prof_lic_status = models.CharField(max_length=100, null=True, blank=True, choices=ProfLicStatus.choices)
    prof_linkedin = models.URLField(max_length=255,null=True, blank=True)
    prof_address_zip = models.CharField(max_length=100,null=True,blank=True)
    prof_social_security_num = models.CharField(max_length=100,null=True,blank=True)
    prof_home_phone = models.CharField(max_length=100,null=True,blank=True)
    prof_alt_phone = models.CharField(max_length=100,null=True,blank=True)
    prof_dob = models.DateField(null=True, blank=True)
    prof_address_years = models.CharField(max_length=100,null=True,blank=True)
    prof_address_months = models.CharField(max_length=100,null=True,blank=True)
    prof_prev_address = models.CharField(max_length=255,null=True,blank=True)
    prof_prev_address_2 = models.CharField(max_length=255,null=True,blank=True)
    prof_prev_city = models.CharField(max_length=255,null=True,blank=True)
    prof_prev_state = models.IntegerField(null=True, blank=True)
    prof_prev_cntry = models.IntegerField(null=True, blank=True)
    prof_bill_address = models.CharField(max_length=255,null=True,blank=True)
    prof_bill_address_2 = models.CharField(max_length=255,null=True,blank=True)
    prof_bill_city = models.CharField(max_length=255,null=True,blank=True)
    prof_bill_state = models.IntegerField(null=True, blank=True)
    prof_bill_cntry = models.IntegerField(null=True, blank=True)
    prof_is_eligible = models.CharField(max_length=100,null=True,blank=True)
    prof_proof_front = models.FileField(upload_to ='uploads/professional/proof',null=True,blank=True)
    prof_proof_back = models.FileField(upload_to ='uploads/professional/proof_back',null=True,blank=True)
    prof_citizenship_status = models.CharField(max_length=100,null=True,blank=True)
    prof_alias_name = models.CharField(max_length=100,null=True,blank=True)
    prof_uscis_number = models.CharField(max_length=100,null=True,blank=True)
    prof_admission_number = models.CharField(max_length=100,null=True,blank=True)
    prof_passport_insurance = models.CharField(max_length=100,null=True,blank=True)


    def __str__(self) -> str:
        return self.prof_first_name
    
    # get all languages of a particular prof
    def get_prof_languages(self):
        return self.prof_langs.all()
    
    # get all disciplines of a particular prof
    def get_prof_disciplines(self):
        return self.prof_discipline.all()
    
    # get all documentation softwares of a particular prof
    def get_prof_doc_softwares(self):
        return self.prof_doc_soft.all()
    
    # get all specialities of a particular prof
    def get_prof_specialities(self):
        return self.prof_speciality.all()
    
     # get all specialities of a particular prof
    def get_prof_work_settings(self):
        return self.prof_work_settings.all()

    class Meta:
        verbose_name = "Professional"
        verbose_name_plural = "Professionals"



class ProfessionalSlots(TimeStampedModel):

    class Status(models.TextChoices):
        AVAILABLE = "Available", "Available"
        BOOKED    = "Booked", "Booked"
        CANCELLED = "Cancelled", "Cancelled"
        DELETED   = "Deleted", "Deleted"

    user         = models.ForeignKey(User, on_delete=models.CASCADE)
    professional = models.ForeignKey(Professional, on_delete=models.CASCADE)
    date         = models.DateField(null=True, blank=True)
    slot         = models.ForeignKey(Slots, on_delete=models.CASCADE)
    status       = models.CharField(max_length=100, choices=Status.choices, default=Status.AVAILABLE)

    def __str__(self):
        return self.professional.prof_first_name

    class Meta:
        verbose_name        = "Professional slot"
        verbose_name_plural = "Professional slots"

class ProfessionalHours(TimeStampedModel):

    class Status(models.TextChoices):
        AVAILABLE = "Available", "Available"
        BOOKED    = "Booked", "Booked"
        CANCELLED = "Cancelled", "Cancelled"
        DELETED   = "Deleted", "Deleted"

    user         = models.ForeignKey(User, on_delete=models.CASCADE)
    professional = models.ForeignKey(Professional, on_delete=models.CASCADE)
    date         = models.DateField(null=True, blank=True)
    hours         = models.IntegerField(null=True, blank=True)
    status       = models.CharField(max_length=100, choices=Status.choices, default=Status.AVAILABLE)

    def __str__(self):
        return self.professional.prof_first_name

    class Meta:
        verbose_name        = "Professional hour"
        verbose_name_plural = "Professional hours"

class ProfessionalEvents(TimeStampedModel):

    user         = models.ForeignKey(User, on_delete=models.CASCADE)
    professional = models.ForeignKey(Professional, on_delete=models.CASCADE)
    date         = models.DateField(null=True, blank=True)
    title        = models.CharField(max_length=100,null=True,blank=True)
    description  = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name        = "Professional Event"
        verbose_name_plural = "Professional Events"


class ProfessionalReferences(TimeStampedModel):
    professional = models.ForeignKey(Professional,on_delete=models.CASCADE)
    name         = models.CharField(max_length=100,null=True,blank=True)
    email        = models.EmailField(null=True,blank=True)
    occupation   = models.CharField(max_length=100,null=True,blank=True)
    relationship = models.CharField(max_length=100,null=True,blank=True)
    address      = models.CharField(max_length=255, null=True, blank=True)
    address2     = models.CharField(max_length=255, null=True, blank=True)
    city         = models.CharField(max_length=100,null=True,blank=True)
    state        = models.CharField(max_length=100,null=True,blank=True)
    country      = models.CharField(max_length=100,null=True,blank=True)
    zipcode      = models.IntegerField(null=True,blank=True)
    phone_number = models.CharField(max_length=100,null=True,blank=True)

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name        = "Professional reference"
        verbose_name_plural = "Professional references"


class LicenseCertificate(TimeStampedModel):

    class LicStatus(models.TextChoices):
        ACTIVE = "Active", "Active"
        INACTIVE = "Inactive", "Inactive"
    
    class LicVerify(models.TextChoices):
        VERIFIED     = "Verified", "Verified"
        NOT_VERIFIED = "Not Verified", "Not Verified"

    professional   = models.ForeignKey(Professional,on_delete=models.CASCADE)
    license_name   = models.CharField(max_length=100, null=True, blank=True)
    discipline     = models.ForeignKey(Discipline, on_delete=models.CASCADE, null=True, blank=True)
    license_number = models.CharField(max_length=100, null=True, blank=True)
    city           = models.CharField(max_length=100, null=True, blank=True)
    state          = models.CharField(max_length=100, null=True, blank=True)
    expired_on     = models.DateField(null=True, blank=True)
    license_file   = models.FileField(upload_to ='uploads/professional/license',null=True,blank=True)
    status         = models.CharField(max_length=100, choices=LicStatus.choices, null=True, blank=True)
    is_verified    = models.CharField(max_length=100, choices=LicVerify.choices, null=True, blank=True, default=LicVerify.NOT_VERIFIED)

    def __str__(self):
        return self.license_name
    
    class Meta:
        verbose_name        = "License certificate"
        verbose_name_plural = "License certificates"


class Certifications(TimeStampedModel):
    professional     = models.ForeignKey(Professional,on_delete=models.CASCADE)
    certificate_name = models.CharField(max_length=100, null=True, blank=True)
    certificate_date = models.DateField(null=True, blank=True)
    cert_exp_date    = models.DateField(null=True, blank=True)
    city             = models.CharField(max_length=100, null=True, blank=True)
    state            = models.CharField(max_length=100, null=True, blank=True)
    country          = models.CharField(max_length=100, null=True, blank=True)
    certificate_file = models.FileField(upload_to ='uploads/professional/certificate',null=True,blank=True)

    def __str__(self):
        return self.certificate_name
    
    class Meta:
        verbose_name        = "Certificate"
        verbose_name_plural = "Certificates"
    

class EmergencyContact(TimeStampedModel):
    
    class ContactType(models.TextChoices):
        PRIMARY   = "Primary","Primary"
        ALTERNATE = "Alternate","Alternate"

    professional = models.ForeignKey(Professional,on_delete=models.CASCADE)
    name         = models.CharField(max_length=100,null=True,blank=True)
    type         = models.CharField(max_length=100,null=True,blank=True,choices=ContactType.choices)
    relationship = models.CharField(max_length=100,null=True,blank=True)
    address      = models.CharField(max_length=255, null=True, blank=True)
    address2     = models.CharField(max_length=255, null=True, blank=True)
    city         = models.CharField(max_length=100,null=True,blank=True)
    state        = models.CharField(max_length=100,null=True,blank=True)
    country      = models.CharField(max_length=100,null=True,blank=True)
    zipcode      = models.IntegerField(null=True,blank=True)
    phone_number = models.CharField(max_length=100,null=True,blank=True)
    alt_phone    = models.CharField(max_length=100,null=True,blank=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name        = "Emergency contact"
        verbose_name_plural = "Emergency contacts"


class Education(TimeStampedModel):

    class EducationType(models.TextChoices):
        HIGH_SCHOOL       = "High School or G.E.D", "High School or G.E.D"
        VOCATIONAL_SCHOOL = "Vocational School", "Vocational School"
        COLLEGE           = "College", "College "
        OTHERS            = "Other", "Other"
    
    professional     = models.ForeignKey(Professional,on_delete=models.CASCADE)
    name             = models.CharField(max_length=100,null=True,blank=True,choices=EducationType.choices)
    course_name      = models.CharField(max_length=100,null=True,blank=True)
    attended_month   = models.CharField(max_length=100,null=True,blank=True)
    attended_year    = models.CharField(max_length=100,null=True,blank=True)
    last_grade       = models.CharField(max_length=100,null=True,blank=True)
    location         = models.CharField(max_length=100,null=True,blank=True)
    is_completed     = models.BooleanField(null=True, blank=True)
    date_completed   = models.DateField(null=True, blank=True)
    certificate_file = models.FileField(upload_to ='uploads/professional/education',null=True,blank=True)
    
    def __str__(self):
        return self.course_name
    
    class Meta:
        verbose_name        = "Education"
        verbose_name_plural = "Educations"


class ReferenceMail(TimeStampedModel):

    class MailType(models.TextChoices):
        MAIL_SENT = "Mail Sent", "Mail Sent"
        ANSWERED  = "Answered", "Answered"

    reference    = models.ForeignKey(ProfessionalReferences, on_delete=models.CASCADE)
    message      = models.TextField(null=True, blank=True)
    status       = models.CharField(max_length=100, null=True, blank=True, choices=MailType.choices)
    mail_sent_on = models.DateTimeField(null=True, blank=True)
    completed_on = models.DateTimeField(null=True, blank=True)
    created_by   = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.status

    class Meta:
        verbose_name        = "Reference Mail"
        verbose_name_plural = "Reference Mails"


class ProfessionalVerifyQA(TimeStampedModel):
    professional = models.ForeignKey(Professional, on_delete=models.CASCADE)
    question     = models.ForeignKey(UserVerificationQA, on_delete=models.CASCADE)
    reference    = models.ForeignKey(ProfessionalReferences, on_delete=models.CASCADE)
    answer       = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return self.answer
    
    class Meta:
        verbose_name        = "Professional Verify QA"
        verbose_name_plural = "Professional Verify QAs"


class EmployeeHistory(TimeStampedModel):
    professional     = models.ForeignKey(Professional,on_delete=models.CASCADE)
    company_name    = models.CharField(max_length=100, null=True, blank=True)
    from_date       = models.DateField(null=True,blank=True)
    to_date         = models.DateField(null=True, blank=True)
    supervisor_name = models.CharField(max_length=100, null=True, blank=True)
    address_1       = models.CharField(max_length=100, null=True, blank=True)
    address_2       = models.CharField(max_length=100, null=True, blank=True)
    city            = models.CharField(max_length=100, null=True, blank=True)
    state           = models.ForeignKey(State, on_delete=models.SET_NULL, null=True, blank=True)
    country         = models.ForeignKey(Country, on_delete=models.SET_NULL, null=True, blank=True)
    zipcode         = models.CharField(max_length=100, null=True, blank=True)
    contact         = models.CharField(max_length=100, null=True, blank=True)
    pay             = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    position_duties = models.TextField(null=True, blank=True)
    resign_reason   = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.company_name
    
    class Meta:
        verbose_name        = "Employee History"
        verbose_name_plural = "Employee Histories"


class ProfessionalSkills(TimeStampedModel):
    professional            = models.ForeignKey(Professional, on_delete=models.CASCADE)
    typing_speed            = models.CharField(max_length=100, null=True, blank=True)
    is_medical_terminology  = models.BooleanField(null=True, blank=True)
    office_machines         = models.CharField(max_length=255, null=True, blank=True)
    computer_skills         = models.ManyToManyField(ComputerSkills)
    other_skills            = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.typing_speed
    
    class Meta:
        verbose_name        = "Professional Skill"
        verbose_name_plural = "Professional Skills"


class ProfessionalDocSetting(TimeStampedModel):

    class Status(models.TextChoices):
        YES = 'Yes', 'Yes'
        NO = 'No', 'No'

    setting_name = models.CharField(max_length=255, null=True, blank=True)
    is_expired   = models.BooleanField(null=True, blank=True)
    status       = models.CharField(max_length=100, null=True, blank=True,choices=Status.choices)

    def __str__(self):
        return self.setting_name
    
    class Meta:
        verbose_name        = "Professional DocSetting"
        verbose_name_plural = "Professional DocSettings"


class ProfessionalDocuments(TimeStampedModel):

    class DocStatus(models.TextChoices):
        ACTIVE = "Active", "Active"
        INACTIVE = "Inactive", "Inactive"
    
    professional = models.ForeignKey(Professional, on_delete=models.CASCADE)
    prof_doc_setting = models.ForeignKey(ProfessionalDocSetting,on_delete=models.CASCADE)
    doc_file = models.FileField(max_length=300, null=True, blank=True)
    doc_expire_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, null=True, blank=True, choices=DocStatus.choices, default=DocStatus.INACTIVE)

    def __str__(self):
        return self.professional.prof_first_name
    
    class Meta:
        verbose_name        = "Professional ProfessionlDocument"
        verbose_name_plural = "Professional ProfessionalDocuments"



