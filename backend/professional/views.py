#rasedfrom django.shortcuts import render
from rest_framework.generics import CreateAPIView,ListAPIView,UpdateAPIView, DestroyAPIView
from .serializers import *
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response
from rest_framework import status
from modules.models import *
from modules.serializers import *
from .models import *
from datetime import datetime
from professional.utils import encode_data,ref_mail
from rest_framework.views import APIView
from rest_framework import viewsets
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.utils import timezone
from django.db.models import Count,Q
from jobs.models import Jobs
from jobs.serializers import JobSerializers,WorkHoursSerializers
from job_request.models import JobProfessionalRequest
from job_request.serializers import JobRequestSerializers
from contract.models import Contract,ContractHours
from contract.serializers import ContractHoursSerializers
from facility.models import Facility
from facility.serializers import FacilitySerializers
from jobs.models import JobWorkHours
from contract.serializers import ContractSerializers
from job_request_messages.models import JobProfessionalRequestMessages
from job_request_messages.serializers import MessageSerailaizers
from contract_messages.models import ContractMessages
from contract_messages.serializers import ContractMessageSerailaizers
from itertools import chain
from operator import attrgetter
from collections import defaultdict
from datetime import timedelta
from invoices.models import Invoices
from invoices.serializers import InvoiceSerializers

# Create your views here.

class CreateProfessional(CreateAPIView):
    serializer_class = ProfessionalSerializers
    permission_classes  = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]


    def post(self, request, *args, **kwargs):
        print(request.data)
        try:
        
            request.data['prof_years_in'] = request.data['prof_years_in']['value']
            request.data['prof_weekly_aval'] = request.data['prof_weekly_aval']['value']
            request.data['prof_state'] = request.data['prof_state']['value']
            request.data['prof_cntry'] = request.data['prof_cntry']['value']

            serializer = self.get_serializer(data=request.data, many=isinstance(request.data,list))
            serializer.is_valid(raise_exception=True)
            professional = serializer.save()

            work_settings = request.data.get('prof_work_settings', [])
            disciplines = request.data.get('prof_discipline', [])
            languages = request.data.get('prof_langs', [])
            doc_software = request.data.get('prof_doc_soft', [])
            specialties = request.data.get('prof_speciality', [])

            category = Categories.objects.get(cat_name="Medical") 
            category_id = category.id
            
            work_settings_created = []
            for work_setting_id in work_settings:
                work_setting = WorkSettingExp.objects.get(
                    id = work_setting_id['value'], category_id=category_id
                )
                
                work_settings_created.append(work_setting)

            
            disciplines_created = []
            for discipline_id in disciplines:
                discipline = Discipline.objects.get(
                    id=discipline_id['value'], category_id=category_id
                )
                
                disciplines_created.append(discipline)

            
            languages_created = []
            for language_id in languages:
                language = Languages.objects.get(
                    id=language_id['value'], category_id=category_id
                )
                
                languages_created.append(language)

            
            doc_software_created = []
            for doc_software_id in doc_software:
                doc_software_record = DocSoftware.objects.get(
                    id=doc_software_id['value'], category_id=category_id
                )
                
                doc_software_created.append(doc_software_record)

            
            specialties_created = []
            for speciality_id in specialties:
                speciality = Speciality.objects.get(
                    id=speciality_id['value'], category_id=category_id
                )

                specialties_created.append(speciality)

            professional.prof_work_settings.set(work_settings_created)
            professional.prof_discipline.set(disciplines_created)
            professional.prof_langs.set(languages_created)
            professional.prof_doc_soft.set(doc_software_created)
            professional.prof_speciality.set(specialties_created)

            professional.save()

            response = {
                "Status":{
                    "Code":"Success"
                },
                "Result":"Profession created successfully",
                "Email":professional.prof_email
            }
            return Response(response,status=status.HTTP_201_CREATED)
        except Exception as e:
            error_response = {
                "Status":{
                    "Code":"Fail"
                },
                "Result":str(e)
            }
            return Response(error_response,status=status.HTTP_400_BAD_REQUEST)


class GetProfessional(ListAPIView):

    serializer_class = ProfessionalSerializers
    permission_classes  = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def get(self, request, *args, **kwags):
        try:
            prof_email = request.GET.get('ProfEmail')

            try:
                prof = Professional.objects.get(prof_email=prof_email)
            except Professional.DoesNotExist:
                raise Exception("Data not Found")

            langs = []
            for language in prof.get_prof_languages():
                langs.append(language.id)
            
            specialities = []
            for speciality in prof.get_prof_specialities():
                specialities.append(speciality.id)
            
            docsofts = []
            for docsoft in prof.get_prof_doc_softwares():
                docsofts.append(docsoft.id)

            disciplines = []
            for discipline in prof.get_prof_disciplines():
                disciplines.append(discipline.id)
            
            work_settings = []
            for work_setting in prof.get_prof_work_settings():
                work_settings.append(work_setting.id)

            serializer = self.serializer_class(prof)
            professional = serializer.data
            
            professional['id'] = prof.id
            professional['Languages'] = langs
            professional['Speciality'] = specialities
            professional['DocSoft'] = docsofts
            professional['Discipline'] = disciplines
            professional['Work_Setting'] = work_settings

            response = {
                "Status":{
                    "Code":"Success"
                },
                "Result" : "Profession Retrived successfully",
                "data"   : professional
            }
            return Response(response,status=status.HTTP_200_OK)
        
        except Exception as e:
            error_response = {
                "Status":{
                    "Code":"Fail"
                },
                "Result":str(e)
            }
            return Response(error_response,status=status.HTTP_400_BAD_REQUEST)
        

class GetProfessionals(APIView):
    serializer_class = ProfessionalSerializers
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def post(self, request, *args, **kwargs):
        try:
            search_filters   = {} 
            current_page     = request.data.get('CurrentPage',None)
            records_per_page = request.data.get('RecordsPerPage',None)
            languages        = request.data.get("Languages",[])
            doc_software     = request.data.get("Software",[])
            work_setting     = request.data.get("WorkSetting",[])
            discipline       = request.data.get("Discipline",[])
            speciality       = request.data.get("Speciality",[])
            weekly_aval      = request.data.get("Weekly Availabiity",[])
            keyword          = request.data.get("Keyword",None)


            professionals = Professional.objects.all().order_by('-created')
            

            #Search by options 
            if languages:
                search_filters["prof_langs__in"] = [lang['value'] for lang in languages]
            
            if doc_software:
                search_filters["prof_doc_soft__in"] = [software['value'] for software in doc_software]
            
            if work_setting:
                search_filters["prof_work_settings__in"] = [work['value'] for work in work_setting]
        
            if discipline:
                search_filters["prof_discipline__in"] = [disp['value'] for disp in discipline]
        
            if speciality:
                search_filters["prof_speciality__in"] = [spl['value'] for spl in speciality]
            
            if weekly_aval:
                search_filters["prof_weekly_aval__in"] = [aval['value'] for aval in weekly_aval]

            if search_filters:
                professionals = professionals.filter(**search_filters)

            #Search by keyword
            if keyword:
                professionals = professionals.filter(
                    Q(prof_first_name__icontains=keyword) | Q(prof_last_name__icontains=keyword)
                )
            
            total_records = professionals.count()
            #Pagination
            if current_page and records_per_page:

                if not isinstance(current_page, int):
                    raise Exception('Current page is invalid')

                if not isinstance(records_per_page, int):
                    raise Exception('Records per page is invalid')
                
                indexOfFirstItem = (current_page - 1) * records_per_page
                indexOfLastItem =  indexOfFirstItem + records_per_page
                professionals = professionals[indexOfFirstItem:indexOfLastItem]
            
            

            result_data = []
            for prof in professionals:
                langs         = [language.id for language in prof.get_prof_languages()]
                specialities  = [speciality.id for speciality in prof.get_prof_specialities()]
                docsofts      = [docsoft.id for docsoft in prof.get_prof_doc_softwares()]
                disciplines   = [discipline.id for discipline in prof.get_prof_disciplines()]
                work_settings = [work_setting.id for work_setting in prof.get_prof_work_settings()]

                serializer = self.serializer_class(prof)
                prof_data  = serializer.data

                prof_data['id']           = prof.id
                prof_data['Languages']    = langs
                prof_data['Speciality']   = specialities
                prof_data['DocSoft']      = docsofts
                prof_data['Discipline']   = disciplines
                prof_data['Work_Setting'] = work_settings
                prof_data['Created']      = prof.created

                result_data.append(prof_data)

            response = {
                "Status": {
                    "Code": "Success"
                },
                "Result": "All professionals retrieved successfully",
                "data": result_data,
                "CurrentPage":current_page,
                "RecordsPerPage":records_per_page,
                "TotalCount":total_records,
                "Languages":languages,
                "Software" :doc_software,
                "WorkSetting":work_setting,
                "Discipline":discipline,
                "Speciality":speciality,
                "Keyword":keyword
            }
            return Response(response, status=status.HTTP_200_OK)
        
        except Exception as e:
            error_response = {
                "Status": {
                    "Code": "Fail"
                },
                "Result": str(e)
            }
            return Response(error_response, status=status.HTTP_400_BAD_REQUEST)
        


class UpdateProfessional(UpdateAPIView):
    serializer_class = ProfessionalSerializers
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def put(self, request, email, *args, **kwargs):
        try:

            try:
                professional = Professional.objects.get(prof_email=email)
            except Professional.DoesNotExist:
                raise Exception("Data not found")

            work_settings = request.data.getlist('Work_Setting', [])
            disciplines = request.data.getlist('Discipline', [])
            languages = request.data.getlist('Languages', [])
            doc_software = request.data.getlist('DocSoft', [])
            specialties = request.data.getlist('Speciality', [])

            multiple_choices = [work_settings, disciplines, languages, doc_software, specialties]
            for i, choices in enumerate(multiple_choices):
                if isinstance(choices, str):
                    if "," in choices:
                        multiple_choices[i] = choices.split(",")
                    else:
                        multiple_choices[i] = list(multiple_choices[i])

            work_settings, disciplines, languages, doc_software, specialties = multiple_choices

            category = Categories.objects.get(cat_name="Medical")
            category_id = category.id

            work_settings_created = []
            for work_setting in work_settings:
                work_setting = WorkSettingExp.objects.get(
                    id=work_setting, category_id=category_id
                )
                work_settings_created.append(work_setting)

            disciplines_created = []
            for discipline in disciplines:
                discipline = Discipline.objects.get(
                    id=discipline, category_id=category_id
                )
                disciplines_created.append(discipline)

            languages_created = []
            for language in languages:
                language = Languages.objects.get(
                    id=language, category_id=category_id
                )
                languages_created.append(language)

            doc_software_created = []
            for doc_software in doc_software:
                doc_software_record = DocSoftware.objects.get(
                    id=doc_software, category_id=category_id
                )
                doc_software_created.append(doc_software_record)

            specialties_created = []
            for speciality in specialties:
                speciality = Speciality.objects.get(
                    id=speciality, category_id=category_id
                )
                specialties_created.append(speciality)

            professional.prof_work_settings.set(work_settings_created)
            professional.prof_discipline.set(disciplines_created)
            professional.prof_langs.set(languages_created)
            professional.prof_doc_soft.set(doc_software_created)
            professional.prof_speciality.set(specialties_created)
            professional.save()
            
            serializer = self.get_serializer(professional, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            professional_data = serializer.save()
            
            response = {
                "Status": {
                    "Code": "Success"
                },
                "Result": "Professional updated successfully",
                "Email": professional_data.prof_email
            }
            return Response(response, status=status.HTTP_200_OK)

        except Exception as e:
            error_response = {
                "Status": {
                    "Code": "Fail"
                },
                "Result": str(e)
            }
            return Response(error_response, status=status.HTTP_400_BAD_REQUEST)

class DeleteProfessional(DestroyAPIView):
    serializer_class       = ProfessionalSerializers
    authentication_classes = [TokenAuthentication]
    permission_classes     = [IsAuthenticated]

    def destroy(self, request, id, *args, **kwargs):
        try:
            if id is not None:
                try:
                    prof_id = int(id)
                except ValueError:
                    raise Exception("Invalid professional id")
            else:
                raise Exception("Professional id must not be empty")

            prof_user = User.objects.filter(id=prof_id)
            if prof_user.exists() > 0:
                prof_user.first().delete()
            else:
                raise Exception("Data not found")
            
            response = {
                "Status": {
                    "Code": "Success"
                },
                "Result": "Professional deleted successfully",
                "id": prof_id
            }
            return Response(response, status=status.HTTP_200_OK)

        except Exception as e:
            error_response = {
                "Status": {
                    "Code": "Fail"
                },
                "Result": str(e)
            }
            return Response(error_response, status=status.HTTP_400_BAD_REQUEST)
        

class CreateProfSlot(CreateAPIView):
    serializer_class = ProfSlotSerializers
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def post(self, request, *args, **kwargs):
        try:
            valid_data = []
            date_slot_map = {}
            
            data = request.data if isinstance(request.data, list) else [request.data]
            
            for request_data in data:
                user = request_data.get('user')
                professional = request_data.get('professional')
                date_str = request_data.get('date')
                slots = request_data.get('slot')
                prof_status = request_data.get('status')
                hours = request_data.get('hours')

                if not date_str:
                    raise Exception("Date must not be empty")

                date = datetime.strptime(date_str, "%m/%d/%Y").date()

                if hours:
                    slot_list = Slots.objects.filter(slot_type="Hour_slots").values_list('id', flat=True)[:hours]
                else:
                    slot_list = slots if isinstance(slots, list) else [slots] if slots else []

                key = (user, professional, date)
                if key not in date_slot_map:
                    date_slot_map[key] = set()
                date_slot_map[key].update(slot_list)

                for slot in slot_list:
                    if not slot:
                        continue
                    exists = ProfessionalSlots.objects.filter(
                        user=user, professional=professional, date=date, slot=slot
                    ).exists()
                    if not exists:
                        valid_data.append({
                            'user': user,
                            'professional': professional,
                            'date': date,
                            'slot': slot,
                            'status': prof_status
                        })

            for (user, professional, date), submitted_slots in date_slot_map.items():
                existing_slots = ProfessionalSlots.objects.filter(user=user, professional=professional, date=date)
                for prof_slot in existing_slots:
                    if prof_slot.slot.id not in submitted_slots:
                        prof_slot.delete()

            created_slots = []
            if valid_data:
                serializer = self.get_serializer(data=valid_data, many=True)
                serializer.is_valid(raise_exception=True)
                created_slots = serializer.save()

            response = {
                "Status": {"Code": "Success"},
                "Result": "Professional slot(s) processed successfully",
                "ProfSlot": [slot.id for slot in created_slots]
            }
            return Response(response, status=status.HTTP_201_CREATED)

        except Exception as e:
            print("ProfSlot Error:", str(e))
            return Response({
                "Status": {"Code": "Fail"},
                "Result": str(e)
            }, status=status.HTTP_400_BAD_REQUEST)



class GetProfSlot(ListAPIView):
    serializer_class = ProfSlotSerializers
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def get(self, request, *args, **kwargs):
        try:
            result = []
            prof_user_id = request.GET.get('ProfUserID',None)
            view = request.GET.get("View", None)

            if prof_user_id is not None and prof_user_id != "":
                try:
                    int(prof_user_id)
                except:
                    raise Exception("ProfSlotID must be an integer")
            else:
                raise Exception("ProfSlotID must be empty")
            
            slot_hour_ids = Slots.objects.filter(slot_type = 'Slots').values_list('id', flat=True)
            try:
                prof_slot = ProfessionalSlots.objects.filter(user_id = prof_user_id, slot__in = slot_hour_ids, status="Available").order_by('-created')
            except ProfessionalSlots.DoesNotExist:
                raise Exception("Data not Found")
            
            available_slots = ProfessionalSlots.objects.filter(user=prof_user_id, status=ProfessionalSlots.Status.AVAILABLE).values('date').annotate(available_count=Count('id'))
            booked_slots    = ProfessionalSlots.objects.filter(user=prof_user_id, status=ProfessionalSlots.Status.BOOKED).values('date').annotate(booked_count=Count('id'))
            
            for slot in available_slots:
                data = {}
                data["date"] = slot['date']
                data["available_count"] = slot['available_count']
                
                if booked_slots.exists():
                    for booked in booked_slots:
                        if booked['date'] == slot['date']:
                            data['booked_count'] = booked['booked_count']
                else:
                    data["booked_count"] = 0

                result.append(data)
            
            serializer = self.serializer_class(prof_slot,many=True)
            prof_slot_data = serializer.data
            
            for slot in prof_slot_data:
                if 'date' in slot:
                    date_obj = datetime.strptime(slot['date'], "%Y-%m-%d")
                    slot['date'] = date_obj.strftime("%m-%d-%Y")

                contract_hours = ContractHours.objects.filter(professional_slots=slot['id'])
                if contract_hours.exists():
                    
                    job = Jobs.objects.get(id = contract_hours.first().job_work_hours.job.id)
                    jobs = JobSerializers(job).data
                    slot['job'] = jobs

                    professional = Professional.objects.get(id=contract_hours.first().contract.job_request.professional.id)
                    prof_data = ProfessionalSerializers(professional).data
                    slot['professional'] = prof_data

                    facility = Facility.objects.get(id=contract_hours.first().contract.job.facility.id)
                    fac_data = FacilitySerializers(facility).data
                    slot['facility'] = fac_data

            response = {
                "Status":{
                    "Code":"Success"
                },
                "Result" : "Professional slot Retrived successfully",
                "data"   : prof_slot_data,
                "calender": result
            }
            return Response(response,status=status.HTTP_200_OK)
        
        except Exception as e:
            error_response = {
                "Status":{
                    "Code":"Fail"
                },
                "Result":str(e)
            }
            return Response(error_response,status=status.HTTP_400_BAD_REQUEST)


class GetHourSlots(ListAPIView):
    serializer_class = ProfSlotSerializers
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def get(self, request, *args, **kwargs):
        try:
            
            prof_user_id = request.GET.get('ProfID',None)

            print(prof_user_id)
            # Validate input
            self.__validate(prof_user_id)

            # Hours Data
            data = self.__slot_hours_data(prof_user_id)

            print("data",data)

            response = {
                "Status":{
                    "Code":"Success"
                },
                "Result" : "Professional slot hours retrived successfully",
                "data"   : data
            }
            return Response(response,status=status.HTTP_200_OK)
        
        except Exception as e:
            error_response = {
                "Status":{
                    "Code":"Fail"
                },
                "Result":str(e)
            }
            return Response(error_response,status=status.HTTP_400_BAD_REQUEST)
    
    def __validate(self, id):
        if id:
            try:
                int(id)
            except:
                raise Exception("ProfSlotID must be an integer")
        else:
            raise Exception("ProfSlotID must be empty")
    

    def __slot_hours_data(self, id):
        
        results = []
        
        slot_hour_ids = Slots.objects.filter(slot_type = 'Hour_slots').values_list('id', flat=True)
        print("slot_hour_ids",slot_hour_ids)
        try:
            prof_slot = ProfessionalSlots.objects.filter(user__id = id, slot__in = slot_hour_ids, status="Available").values('user', 'professional', 'date', 'status').annotate(hours=Count('date')).order_by('-date')
        except ProfessionalSlots.DoesNotExist:
            raise Exception("Data not Found")
        print("prof_slot",prof_slot)
        for slot in prof_slot:
            data = {
                "user": slot['user'],
                "professional": slot['professional'],
                "date": slot['date'],
                "hours": slot['hours'],
                "status": slot['status']
            }

            results.append(data)
        print("results",results)
        
        return results

        


class UpdateProfSlot(UpdateAPIView):
    serializer_class = ProfSlotSerializers
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def put(self, request, id, *args, **kwargs):
        try:
            if id is not None and id != "":
                try:
                    int(id)
                except:
                    raise Exception("ID must be an integer")
            else:
                raise Exception("ID must be empty")
            
            try:
                prof_slot = ProfessionalSlots.objects.get(id=id)
            except ProfessionalSlots.DoesNotExist:
                raise Exception("Data not found")

            serializer = self.get_serializer(prof_slot, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            prof_slot_data = serializer.save()
           
            response = {
                "Status": {
                    "Code": "Success"
                },
                "Result": "Professional slot updated successfully",
                "ProfSlot": prof_slot_data.id
            }
            return Response(response, status=status.HTTP_200_OK)

        except Exception as e:
            error_response = {
                "Status": {
                    "Code": "Fail"
                },
                "Result": str(e)
            }
            return Response(error_response, status=status.HTTP_400_BAD_REQUEST)

class CreateLicense(CreateAPIView):
    serializer_class = LicenseSerializers
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self,request,*args, **kwarsg):
        try:
            print(request.data)
            serializer = self.get_serializer(data=request.data, many=isinstance(request.data,list))
            serializer.is_valid(raise_exception=True)
            slot = serializer.save()

            response = {
                "Status":{
                    "Code":"Success"
                },
                "Result":"Slot created successfully",
                "Slot":slot.id
            }
            return Response(response,status=status.HTTP_201_CREATED)
        except Exception as e:
            error_response = {
                "Status":{
                    "Code":"Fail"
                },
                "Result":str(e)
            }
            return Response(error_response,status=status.HTTP_400_BAD_REQUEST)


class SendVerifyEmail(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes     = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            prof_id = request.data.get('ProfID',None)
            email   = None
            context = {}
            
            if prof_id:
                try:
                    int(prof_id)
                except:
                    raise Exception("Invalid ProfID")
            else:
                raise Exception("ProfID must be empty")

            prof_data = Professional.objects.filter(id=prof_id)
            if prof_data.count() > 0:
                prof_data = prof_data.first()
                prof_ref = ProfessionalReferences.objects.filter(professional = prof_data)
                if prof_ref.count() > 0:
                    for ref_data in prof_ref:
                        email = ref_data.email
                        context['frontend_url'] = settings.FRONTEND_URL
                        context['encoded_prof_ref_id'] = encode_data(f"{prof_data.id}--{ref_data.id}")
                        if email:
                            subject = "Verification Link for User Verification"
                            message = render_to_string('email_verification/verify_email.html', context)
                            mail_sent = ref_mail(subject, message, email)
                            if mail_sent:
                                ref_mail_data = ReferenceMail.objects.filter(reference=ref_data)
                                if not ref_mail_data.exists():
                                    ReferenceMail.objects.create(
                                        reference    = ref_data,
                                        message      = message,
                                        status       = "Mail Sent",
                                        mail_sent_on = timezone.now(),
                                        created_by   = prof_data.user
                                    )
                                
                                prof_data.prof_ref_verify = "Open"
                                prof_data.save()
                        else:
                            raise Exception("Invalid email address")
                else:
                    raise Exception("Reference not found, please add a reference")
            else:
                raise Exception("professional data not found")

            response = {
                "Status":{
                    "Code":"Success"
                },
                "Result":"Email sent successfully",
            }
            return Response(response,status=status.HTTP_200_OK)

        except Exception as e:
            error_response = {
                "Status":{
                    "Code":"Fail"
                },
                "Result":str(e)
            }
            return Response(error_response,status=status.HTTP_400_BAD_REQUEST)


class CreateProfVerifyQA(CreateAPIView):
    serializer_class       = VerifyQASerializers
    authentication_classes = [TokenAuthentication]
    permission_classes     = [IsAuthenticated]

    def post(self,request,*args, **kwarsg):
        try:
            prof_id     = request.data[0]['professional']
            prof_ref_id = request.data[0]['reference']

            verify_qa = ProfessionalVerifyQA.objects.filter(professional__id = prof_id, reference__id = prof_ref_id)
            if verify_qa.exists():
                raise Exception("Answers already recorded")
            else:
                serializer = self.serializer_class(data=request.data, many=isinstance(request.data,list))
                serializer.is_valid(raise_exception=True)
                serializer.save()

                response = {
                    "Status":{
                        "Code":"Success"
                    },
                    "Result":"Answers recorded successfully",
                }
                return Response(response,status=status.HTTP_201_CREATED)
        except Exception as e:
            error_response = {
                "Status":{
                    "Code":"Fail"
                },
                "Result":str(e)
            }
            return Response(error_response,status=status.HTTP_400_BAD_REQUEST)


class VerifyQA(ListAPIView):
    serializer_class       = VerifyQASerializers
    authentication_classes = [TokenAuthentication]
    permission_classes     = [IsAuthenticated]

    def get(self,request,*args, **kwarsg):
        try:
            result      = []
            prof_id     = request.GET.get('profID', None)
            prof_ref_id = request.GET.get('refID', None)

            verify_qa = ProfessionalVerifyQA.objects.filter(professional__id = prof_id, reference__id = prof_ref_id)
            if verify_qa.exists():
                serializer = self.serializer_class(verify_qa, many=True)
                result = serializer.data
            else:
                raise Exception("Answers not recorded yet")
            print(result)
            response = {
                "Status":{
                    "Code":"Success",
                    "Result":"Answers retrived successfully"
                },
                "data":result
            }
            print(response)
            return Response(response,status=status.HTTP_200_OK)
        except Exception as e:
            error_response = {
                "Status":{
                    "Code":"Fail"
                },
                "Result":str(e)
            }
            return Response(error_response,status=status.HTTP_400_BAD_REQUEST)



class UpdateRefMail(UpdateAPIView):
    serializer_class       = RefMailSerializers
    authentication_classes = [TokenAuthentication]
    permission_classes     = [IsAuthenticated]

    def put(self, request, id, *args, **kwargs):
        try:
            try:
                reference = ReferenceMail.objects.get(reference=id)
            except ReferenceMail.DoesNotExist:
                raise Exception("Reference not found")

            serializer = self.get_serializer(reference, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            ref_data = serializer.save()
           
            response = {
                "Status": {
                    "Code": "Success"
                },
                "Result": "Reference updated successfully",
                "id": ref_data.id
            }
            return Response(response, status=status.HTTP_200_OK)

        except Exception as e:
            error_response = {
                "Status": {
                    "Code": "Fail"
                },
                "Result": str(e)
            }
            return Response(error_response, status=status.HTTP_400_BAD_REQUEST)
        

class UpdateProfStatus(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes     = [IsAuthenticated]

    def put(self, request, id, *args, **kwargs):
        try:
            response = {"Status": {}}
            prof_data = Professional.objects.filter(id=id)
            if prof_data.exists():
                prof_data = prof_data.first()
                ref_data = ProfessionalReferences.objects.filter(professional=prof_data)
                ref_mail = ReferenceMail.objects.filter(reference__in=ref_data.values_list('id', flat=True), status="Answered")

                if ref_data.count() == ref_mail.count():
                    prof_data.prof_ref_verify = Professional.ProfRefStatus.CLOSED
                    prof_data.prof_status = Professional.ProfStatus.ACTIVE
                    prof_data.prof_activated_on = timezone.now()
                    prof_data.prof_ref_verified_on = timezone.now()
                    prof_data.save()
                    response["Status"]['Code'] = "Success"
                    response["Result"] = "Professional updated successfully"
                    response["ProfID"] = prof_data.id
                else:
                    response["Status"]['Code'] = "Empty"
                    response["Result"] = "All references are still not completed the QA"
        
            return Response(response, status=status.HTTP_200_OK)

        except Exception as e:
            error_response = {
                "Status": {
                    "Code": "Fail"
                },
                "Result": str(e)
            }
            return Response(error_response, status=status.HTTP_400_BAD_REQUEST)


class SearchProfSlot(APIView):
    serializer_class = ProfSlotSerializers
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            data       = ProfessionalSlots.objects.all()
            start_date = request.data.get("start_date", None)
            end_date   = request.data.get("end_date",None)

            if (start_date and not end_date) or (not start_date and end_date):
                raise Exception("Please select both dates")
            
            if end_date and start_date:
                end_date = end_date.split("T")[0]
                start_date = start_date.split("T")[0]
                prof_slots = ProfessionalSlots.objects.filter(date__range=[start_date,end_date], status="Available")
                if prof_slots.exists():
                    data = prof_slots
            
            serializer = self.serializer_class(data, many=True)
            slot_data = serializer.data
            
            response = {
                    "Status": {
                        "Code": "Success"
                    },
                    "Result": "Search slots retrived successfully",
                    "data": slot_data
                }
            return Response(response, status=status.HTTP_200_OK)

        except Exception as e:
            error_response = {
                "Status": {
                    "Code": "Fail"
                },
                "Result": str(e)
            }
            return Response(error_response, status=status.HTTP_400_BAD_REQUEST)


class LicenseViewSet(viewsets.ModelViewSet):
    queryset = LicenseCertificate.objects.all()
    serializer_class = LicenseSerializers
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = LicenseCertificate.objects.all()
        prof_id = self.request.query_params.get('ProfID', None)
        if prof_id is not None:
            queryset = queryset.filter(professional__id=prof_id)
        return queryset

class EducationViewSet(viewsets.ModelViewSet):
    queryset = Education.objects.all()
    serializer_class = EducationSerializers
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Education.objects.all()
        prof_id = self.request.query_params.get('ProfID', None)
        if prof_id is not None:
            queryset = queryset.filter(professional__id=prof_id)
        return queryset

class ContactViewSet(viewsets.ModelViewSet):
    queryset = EmergencyContact.objects.all()
    serializer_class = ContactSerializers
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = EmergencyContact.objects.all()
        prof_id = self.request.query_params.get('ProfID', None)
        if prof_id is not None:
            queryset = queryset.filter(professional__id=prof_id)
        return queryset

class ReferenceViewSet(viewsets.ModelViewSet):
    queryset = ProfessionalReferences.objects.all()
    serializer_class = ReferenceSerializers
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = ProfessionalReferences.objects.all()
        prof_id = self.request.query_params.get('ProfID', None)
        if prof_id is not None:
            queryset = queryset.filter(professional__id=prof_id)
        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        references_with_mails = []
        for reference in queryset:
            reference_data = self.serializer_class(reference).data
            reference_mails = ReferenceMail.objects.filter(reference=reference)
            reference_mail_data = RefMailSerializers(reference_mails, many=True).data
            reference_data['reference_mails'] = reference_mail_data
            references_with_mails.append(reference_data)
        return Response(references_with_mails)

class CertificationViewSet(viewsets.ModelViewSet):
    queryset = Certifications.objects.all()
    serializer_class = CertificationSerializers
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Certifications.objects.all()
        prof_id = self.request.query_params.get('ProfID', None)
        if prof_id is not None:
            queryset = queryset.filter(professional__id=prof_id)
        return queryset

class HistoryViewSet(viewsets.ModelViewSet):
    queryset = EmployeeHistory.objects.all()
    serializer_class = HistorySerializers
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = EmployeeHistory.objects.all()
        prof_id = self.request.query_params.get('ProfID', None)
        if prof_id is not None:
            queryset = queryset.filter(professional__id=prof_id)
        return queryset
    

class SkillsViewSet(viewsets.ModelViewSet):
    queryset = ProfessionalSkills.objects.all()
    serializer_class = SkillSerializers
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        print("Skills", self.request)
        queryset = ProfessionalSkills.objects.all()
        prof_id = self.request.query_params.get('ProfID', None)
        if prof_id is not None:
            queryset = queryset.filter(professional__id=prof_id)
        return queryset
    

class DocSettingViewSet(viewsets.ModelViewSet):
    queryset = ProfessionalDocSetting.objects.all()
    serializer_class = DocSettingSeraializers
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = ProfessionalDocSetting.objects.all()
        doc_status = self.request.query_params.get('Status', None)
        if doc_status is not None:
            queryset = queryset.filter(status=doc_status)
        return queryset


class EventViewSet(viewsets.ModelViewSet):
    queryset = ProfessionalEvents.objects.all()
    serializer_class = ProfEventSeraializers
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = ProfessionalEvents.objects.all()
        prof_id = self.request.query_params.get('ProfID', None)
        if prof_id is not None:
            queryset = queryset.filter(professional__id=prof_id)
        return queryset


class HoursViewSet(viewsets.ModelViewSet):
    queryset = ProfessionalHours.objects.all()
    serializer_class = ProfHourSeraializers
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = ProfessionalHours.objects.all()
        prof_id = self.request.query_params.get('ProfID')
        if prof_id:
            queryset = queryset.filter(professional__id=prof_id)
        return queryset

    def create(self, request, *args, **kwargs):
        data_list = request.data if isinstance(request.data, list) else [request.data]
        created ,updated, deleted = [], [], []

        for data in data_list:
            professional = data.get('professional')
            date = data.get('date')
            hours = data.get('hours')
            status_value = data.get('status')

            if not professional or not date:
                continue
            
            existing = ProfessionalHours.objects.filter(professional=professional, date=date).first()
            if existing:
                if hours:
                    existing.hours = hours
                    existing.status = status_value
                    existing.save()
                    updated.append(existing)
                else:
                    existing.delete()
                    deleted.append({'professional': professional, 'date': date})
            else:
                if hours:
                    serializer = self.get_serializer(data=data)
                    serializer.is_valid(raise_exception=True)
                    obj = serializer.save()
                    created.append(obj)

        response_data = {
            "Status": {"Code": "Success"},
            "Result": "Professional hours processed successfully.",
            "Created": [s.id for s in created],
            "Updated": [s.id for s in updated],
            "Deleted": deleted,
        }

        return Response(response_data, status=status.HTTP_201_CREATED)




class ProfDocumentViewSet(viewsets.ModelViewSet):
    queryset = ProfessionalDocuments.objects.all()
    serializer_class = ProfDocSeraializers
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = ProfessionalDocuments.objects.all()
        prof_id = self.request.query_params.get('ProfID', None)
        if prof_id is not None:
            queryset = queryset.filter(professional__id=prof_id)
        return queryset

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        new_file = request.FILES.get('doc_file')
        if new_file and instance.doc_file:
            instance.doc_file.delete(save=False)

        return super().partial_update(request, *args, **kwargs)


class GetRequestedHours(ListAPIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def get(self, request, *args, **kwargs):
        try:
            prof_id = request.GET.get("ProfID", None)

            if prof_id:
                try:
                    int(prof_id)
                except ValueError:
                    raise Exception("Invalid professional id")
            else:
                raise Exception("Professional id must not be empty")
            
            requested_hours = []
            job_request = JobProfessionalRequest.objects.filter(professional__id = prof_id, status__in = ['New', 'Open', 'Interested', 'Confirmed']).distinct()
            
            if job_request.exists():
                job_ids         = job_request.values_list('job',flat=True)
                job_works_hours = JobWorkHours.objects.filter(job__id__in = job_ids)
                
                if job_works_hours.exists():
                    serializer      = WorkHoursSerializers(job_works_hours, many=True)
                    requested_hours = serializer.data

                    for hours in requested_hours:
                        job               = Jobs.objects.get(id = hours['job'])
                        job_data          = JobSerializers(job).data
                        hours['job_data'] = job_data

                        job_request      = JobProfessionalRequest.objects.filter(job__id = hours['job']).distinct()
                        job_request_data = JobRequestSerializers(job_request.first()).data
                        hours['data']    = job_request_data

                        facility               = Facility.objects.get(id = job_data['facility'])
                        facility_data          = FacilitySerializers(facility).data
                        hours['facility_data'] = facility_data
            
            response = {
                "Status":{
                    "Code":"Success",
                    "Result":"Professional requested hours retrived successfully"
                },
                "data":requested_hours
            }
            return Response(response,status=status.HTTP_200_OK)
        
        except Exception as e:
            error_response = {
                "Status":{
                    "Code":"Fail"
                },
                "Result":str(e)
            }
            return Response(error_response,status=status.HTTP_400_BAD_REQUEST)


class GetContractHours(ListAPIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def get(self, request, *args, **kwargs):
        try:
            prof_id = request.GET.get("ProfID", None)

            if prof_id:
                try:
                    int(prof_id)
                except ValueError:
                    raise Exception("Invalid professional id")
            else:
                raise Exception("Professional id must not be empty")
            
            contract_hours_data = []
            contract_hours = ContractHours.objects.filter(professional_slots__professional__id = prof_id)
            if contract_hours.exists():
                job_work_hour_ids = contract_hours.values_list('job_work_hours', flat=True)
                job_works_hours   = JobWorkHours.objects.filter(id__in = job_work_hour_ids)

                if job_works_hours.exists():
                    serializer          = WorkHoursSerializers(job_works_hours, many=True)
                    contract_hours_data = serializer.data

                    for hours in contract_hours_data:
                        job               = Jobs.objects.get(id = hours['job'])
                        job_data          = JobSerializers(job).data
                        hours['job_data'] = job_data

                        contract      = Contract.objects.get(job__id = hours['job'])
                        contract_data = ContractSerializers(contract).data
                        hours['data'] =  contract_data
                       
                        facility               = Facility.objects.get(id = job_data['facility'])
                        facility_data          = FacilitySerializers(facility).data
                        hours['facility_data'] = facility_data

            response = {
                "Status":{
                    "Code":"Success",
                    "Result":"Professional contract hours retrived successfully"
                },
                "data":contract_hours_data
            }
            return Response(response,status=status.HTTP_200_OK)
        
        except Exception as e:
            error_response = {
                "Status":{
                    "Code":"Fail"
                },
                "Result":str(e)
            }
            return Response(error_response,status=status.HTTP_400_BAD_REQUEST)
        

# dasnboard

class ProfTotalCount(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            prof_id = request.data.get('ProfID', None)

            job_request  = JobProfessionalRequest.objects.filter(professional__id = prof_id).count()
            contracts    = Contract.objects.filter(job_request__professional__id = prof_id).count()
            shifts       = ContractHours.objects.filter(contract__job_request__professional__id = prof_id).count()

            response = {
                "Status":{
                    "Code":"Success",
                    "Result":"Professional total count retrived successfully"
                },
                "job_requests" : job_request,
                "contracts"    : contracts,
                "shifts"       : shifts
            }
            return Response(response,status=status.HTTP_200_OK)
        
        except Exception as e:
            error_response = {
                "Status":{
                    "Code":"Fail"
                },
                "Result":str(e)
            }
            return Response(error_response,status=status.HTTP_400_BAD_REQUEST)


class ProfShifts(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes     = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            prof_id = request.data.get('ProfID', None)
            filter_type = request.data.get('FilterType')

            date_filter = Q()
            now = timezone.now()

            if filter_type == "Last7Days":
                start_date = now - timedelta(days=7)
                date_filter = Q(professional_slots__date__gte=start_date.date())
            elif filter_type == "ThisMonth":
                start_of_month = now.replace(day=1)
                date_filter = Q(professional_slots__date__gte=start_of_month.date())
            
            shifts = ContractHours.objects.filter(contract__job_request__professional__id = prof_id).filter(date_filter).order_by('-created')[:6]
            shift_data = ContractHoursSerializers(shifts, many=True).data

            for shift in shift_data:
                contract = Contract.objects.filter(id = shift['contract'])
                if contract.exists():
                    contract = contract.first()
                    shift['contract_data'] = ContractSerializers(contract).data

                    facility = Facility.objects.filter(id = contract.job.facility.id)
                    if facility.exists():
                        facility          = facility.first()
                        fac_data          = FacilitySerializers(facility).data
                        shift['facility'] = fac_data

                        fac_data['Languages']    = [lang.id for lang in facility.get_fac_languages()]
                        fac_data['Speciality']   = [spl.id for spl in facility.get_fac_specialities()]
                        fac_data['DocSoft']      = [ds.id for ds in facility.get_fac_doc_softwares()]
                        fac_data['Discipline']   = [disp.id for disp in facility.get_fac_disciplines()]
                        fac_data['Work_Setting'] = [ws.id for ws in facility.get_fac_work_settings()]
                    
                    prof_slot = ProfessionalSlots.objects.filter(id = shift['professional_slots'])
                    if prof_slot.exists():
                        prof_slot_data     = ProfSlotSerializers(prof_slot.first()).data
                        shift['prof_slot'] = prof_slot_data

                        # slot
                        slot = Slots.objects.filter(id = prof_slot_data['slot'])
                        if slot.exists():
                            slot_data = SlotSerializers(slot.first()).data
                            shift['slots'] = slot_data
                        else:
                            shift['slots'] = None
                        
                    else:
                        shift['prof_slot'] = None

            response = {
                "Status":{
                    "Code":"Success",
                    "Result":"Facility shifts retrived successfully"
                },
                "data" : shift_data
            }
            return Response(response,status=status.HTTP_200_OK)
        
        except Exception as e:
            error_response = {
                "Status":{
                    "Code":"Fail"
                },
                "Result":str(e)
            }
            return Response(error_response,status=status.HTTP_400_BAD_REQUEST)



class ProfNotications(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            combined_messages = []
            prof_user_id = request.data.get('ProfUserID', None)
            
            request_messages = JobProfessionalRequestMessages.objects.filter(message_to=prof_user_id, status="New").order_by('-created')[:5]
            contract_messages = ContractMessages.objects.filter(message_to = prof_user_id, status="New").order_by('-created')[:5]

            messages = sorted(chain(request_messages, contract_messages),key=attrgetter('created'),reverse=True)[:5]

            for msg in messages:
                if isinstance(msg, JobProfessionalRequestMessages):
                   message_data = MessageSerailaizers(msg).data
                elif isinstance(msg, ContractMessages):
                    message_data = ContractMessageSerailaizers(msg).data
                
                # Facility 
                try:
                    fac = Facility.objects.get(user__id=message_data["message_from"])
                    message_data["facility"] = FacilitySerializers(fac).data
                except Facility.DoesNotExist:
                    message_data["facility"] = None

                # Professional
                try:
                    prof = Professional.objects.get(user__id=message_data["message_to"])
                    message_data["professional"] = ProfessionalSerializers(prof).data
                except Professional.DoesNotExist:
                    message_data["professional"] = None

                combined_messages.append(message_data)

            response = {
                "Status":{
                    "Code":"Success",
                    "Result":"Professional notifications retrived successfully"
                },
                "messages" : combined_messages
            }
            return Response(response,status=status.HTTP_200_OK)
        
        except Exception as e:
            error_response = {
                "Status":{
                    "Code":"Fail"
                },
                "Result":str(e)
            }
            return Response(error_response,status=status.HTTP_400_BAD_REQUEST)


class ProfInvoices(APIView):
    serializer_class       = InvoiceSerializers
    authentication_classes = [TokenAuthentication]
    permission_classes     = [IsAuthenticated]

    def __get_professional(self, id):
        prof_data = {}
        professional = Professional.objects.filter(id = id)
        if professional.exists():
            prof_data = ProfessionalSerializers(professional.first()).data
        
        return prof_data
    
    def __get_facility(self, id):
        fac_data = {}
        facility = Facility.objects.filter(id = id)
        if facility.exists():
            fac_data = FacilitySerializers(facility.first()).data
        
        return fac_data

    def __get_contract (self, id):
        con_data = {}
        contract = Contract.objects.filter(id = id)
        if contract.exists():
            con_data = ContractSerializers(contract.first()).data
        
        return con_data

    def post(self, request, *args, **kwargs):
        try:
            invoice_data = []
            prof_id      = request.data.get('ProfID', None)
            
            invoices = Invoices.objects.filter(professional__id = prof_id)
            if invoices.exists():
                serializer   = InvoiceSerializers(invoices, many=True)
                invoice_data = serializer.data

                for data in invoice_data:
                    data["professional"] = self.__get_professional(data['professional'])
                    data["facility"]     = self.__get_facility(data['facility'])
                    data["contract"]     = self.__get_contract(data['contract'])

            response = {
                "Status":{
                    "Code":"Success",
                    "Result":"Facility invoices retrived successfully"
                },
                "data" : invoice_data
            }
            return Response(response,status=status.HTTP_200_OK)
        
        except Exception as e:
            error_response = {
                "Status":{
                    "Code":"Fail"
                },
                "Result":str(e)
            }
            return Response(error_response,status=status.HTTP_400_BAD_REQUEST)


class ProfWeeklyShifts(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            prof_id = request.data.get('ProfID', None)

            if not prof_id:
                raise Exception("ProfID must not be empty")

            # Parse the input date
            input_date = timezone.now().date()

            # Calculate previous week's Monday to Sunday
            current_monday = input_date - timedelta(days=input_date.weekday())
            prev_monday = current_monday - timedelta(days=7)
            prev_sunday = prev_monday + timedelta(days=6)

            grouped_shifts = defaultdict()
            daily_counts = defaultdict()

            # Prepopulate with empty values
            for i in range(7):
                day = prev_monday + timedelta(days=i)
                key = day.strftime('%A')
                grouped_shifts[key] = ""
                daily_counts[key] = 0

            # Fetch relevant shifts
            shifts = ContractHours.objects.filter(
                contract__job_request__professional__id=prof_id,
                created__date__range=(prev_monday, prev_sunday)
            ).order_by('-created')

            for shift in shifts:
                shift_serialized = ContractHoursSerializers(shift).data

                contract = shift.contract
                shift_serialized['contract_data'] = ContractSerializers(contract).data

                professional = contract.job_request.professional
                prof_data = ProfessionalSerializers(professional).data

                prof_data['Languages'] = [lang.id for lang in professional.get_prof_languages()]
                prof_data['Speciality'] = [spec.id for spec in professional.get_prof_specialities()]
                prof_data['DocSoft'] = [doc.id for doc in professional.get_prof_doc_softwares()]
                prof_data['Discipline'] = [disc.id for disc in professional.get_prof_disciplines()]
                prof_data['Work_Setting'] = [ws.id for ws in professional.get_prof_work_settings()]

                shift_serialized['professional'] = prof_data

                shift_date = shift.created.date()
                key = shift_date.strftime('%A')

                if grouped_shifts[key] == "":
                    grouped_shifts[key] = [shift_serialized]
                else:
                    grouped_shifts[key].append(shift_serialized)

                daily_counts[key] += 1

            response = {
                "Status": {
                    "Code": "Success",
                    "Result": "Previous week facility shifts retrieved successfully"
                },
                "data": grouped_shifts,
                "daily_counts": daily_counts,
                "week_range": {
                    "start": prev_monday.isoformat(),
                    "end": prev_sunday.isoformat()
                }
            }
            return Response(response, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                "Status": {"Code": "Fail"},
                "Result": str(e)
            }, status=status.HTTP_400_BAD_REQUEST)


class ProfRecentRequest(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            request_data = []
            prof_id = request.data.get('ProfID')
            filter_type = request.data.get('FilterType')

            date_filter = Q()
            now = timezone.now()

            if filter_type == "Last7Days":
                start_date = now - timedelta(days=7)
                date_filter = Q(created__date__gte=start_date.date())
            elif filter_type == "ThisMonth":
                start_of_month = now.replace(day=1)
                date_filter = Q(created__date__gte=start_of_month.date())
            
            job_request = JobProfessionalRequest.objects.filter(professional__id = prof_id).filter(date_filter).order_by('-created')
            if job_request.exists():
                request_data = JobRequestSerializers(job_request, many=True).data

                for data in request_data:

                    # Jobs
                    job = Jobs.objects.filter(id = data['job'])
                    if job.exists():
                        job_data = JobSerializers(job.first()).data
                        data['job'] = job_data

                        # Facility
                        facility = Facility.objects.filter(id = job_data["facility"])
                        if facility.exists():
                            facility = facility.first()
                            fac_data = FacilitySerializers(facility).data
                            data['facility'] = fac_data
                            fac_data['Languages'] = [lang.id for lang in facility.get_fac_languages()]
                            fac_data['Speciality'] = [spec.id for spec in facility.get_fac_specialities()]
                            fac_data['DocSoft'] = [doc.id for doc in facility.get_fac_doc_softwares()]
                            fac_data['Discipline'] = [disc.id for disc in facility.get_fac_disciplines()]
                            fac_data['Work_Setting'] = [ws.id for ws in facility.get_fac_work_settings()]
                        else:
                            data['facility'] = None

                    else:
                        data['job'] = None
            
            response = {
                "Status": {
                    "Code": "Success",
                    "Result": " Job Request data retrieved successfully"
                },
                "data": request_data
            }
            return Response(response, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                "Status": {"Code": "Fail"},
                "Result": str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
        

class UpcomingShifts(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]


    def post(self, request, *args, **kwargs):
        try:

            hrs_data = []
            prof_id  = request.data.get("ProfID", None)

            today        = timezone.now().date()
            current_time = timezone.now().time()

            upcoming_shifts = ContractHours.objects.filter(
                status=ContractHours.HourStatus.ACTIVE,
                professional_slots__isnull=False,
                professional_slots__professional__id = prof_id,
                professional_slots__date=today,
                professional_slots__slot__start_hr__gt=current_time
            ).select_related('professional_slots__slot', 'contract')

            print("upcoming_shifts",upcoming_shifts)

            if upcoming_shifts.exists():
                hrs_data = ContractHoursSerializers(upcoming_shifts, many=True).data

                for hrs in hrs_data:

                    # Contract
                    contract = Contract.objects.filter(id = hrs['contract']).first()
                    if contract:
                        contract_data   = ContractSerializers(contract).data
                        hrs['contract'] = contract_data

                        #Facility
                        facility = Facility.objects.filter(id = contract.job.facility.id).first()
                        if facility:
                            fac_data = FacilitySerializers(facility).data
                            hrs['facility'] = fac_data
                            fac_data['Languages'] = [lang.id for lang in facility.get_fac_languages()]
                            fac_data['Speciality'] = [spec.id for spec in facility.get_fac_specialities()]
                            fac_data['DocSoft'] = [doc.id for doc in facility.get_fac_doc_softwares()]
                            fac_data['Discipline'] = [disc.id for disc in facility.get_fac_disciplines()]
                            fac_data['Work_Setting'] = [ws.id for ws in facility.get_fac_work_settings()]
                    
                    # Professional Slots
                    prof_slot = ProfessionalSlots.objects.filter(id = hrs['professional_slots']).first()
                    if prof_slot:
                        prof_slot_data = ProfSlotSerializers(prof_slot).data
                        hrs['prof_slot'] = prof_slot_data

                        # Slots
                        slot = Slots.objects.filter(id = prof_slot_data['slot']).first()
                        if slot:
                            slot_data = SlotSerializers(slot).data
                            hrs['slot'] = slot_data
            response = {
                "Status": {
                    "Code": "Success",
                    "Result": " Job Request data retrieved successfully"
                },
                "data": hrs_data
            }
            return Response(response, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                "Status": {"Code": "Fail"},
                "Result": str(e)
            }, status=status.HTTP_400_BAD_REQUEST)