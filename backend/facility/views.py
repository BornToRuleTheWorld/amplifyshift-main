from django.shortcuts import render
from rest_framework.generics import CreateAPIView,ListAPIView,UpdateAPIView
from .serializers import *
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response
from rest_framework import status, viewsets
from modules.models import *
from modules.serializers import *
from .models import *
from professional.models import Professional,ProfessionalSlots
from professional.serializers import ProfessionalSerializers
from jobs.models import JobWorkHours, Jobs
from jobs.serializers import JobSerializers, WorkHoursSerializers, HourSerializers
from job_request.models import JobProfessionalRequest
from contract.models import *
from contract.serializers import *
from rest_framework.views import APIView
from django.db.models import Q
from rest_framework.exceptions import ValidationError
from datetime import datetime
from job_request.serializers import *
from django.utils import timezone
from job_request_messages.models import JobProfessionalRequestMessages
from job_request_messages.serializers import MessageSerailaizers
from contract_messages.models import ContractMessages
from contract_messages.serializers import ContractMessageSerailaizers
from invoices.models import Invoices
from invoices.serializers import InvoiceSerializers
from itertools import chain
from operator import attrgetter
from collections import defaultdict, OrderedDict
from datetime import timedelta
from .utils import zipcodes

# Create your views here.
class CreateFacility(CreateAPIView):
    serializer_class = FacilitySerializers
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def post(self, request, *args, **kwargs):
        try:
            data = request.data
            data['fac_weekly_visit'] = data['fac_weekly_visit']['value']
            data['fac_wrk_exp'] = data['fac_wrk_exp']['value']
            data['fac_state'] = data['fac_state']['value']
            data['fac_cntry'] = data['fac_cntry']['value']
            serializer = self.serializer_class(data=data, many=isinstance(data, list))
            serializer.is_valid(raise_exception=True)
            facility = serializer.save()

            work_settings = data.get('fac_wrk_setting', [])
            disciplines = data.get('fac_discipline', [])
            languages = data.get('fac_langs', [])
            doc_software = data.get('fac_doc_soft', [])
            specialties = data.get('fac_speciality', [])

            # multiple_choices = [work_settings, disciplines, languages, doc_software, specialties]
            # for i, choices in enumerate(multiple_choices):
            #     if isinstance(choices, str):
            #         if "," in choices:
            #             multiple_choices[i] = choices.split(",")
            #         else:
            #             multiple_choices[i] = [multiple_choices[i]]

            # work_settings, disciplines, languages, doc_software, specialties = multiple_choices

            category = Categories.objects.get(cat_name="Medical")
            category_id = category.id

            work_settings_created = []
            for work_setting in work_settings:
                work_setting_instance = WorkSettingExp.objects.get(
                    id=work_setting['value'], category_id=category_id
                )
                work_settings_created.append(work_setting_instance)

            disciplines_created = []
            for discipline in disciplines:
                discipline_instance = Discipline.objects.get(
                    id=discipline['value'], category_id=category_id
                )
                disciplines_created.append(discipline_instance)

            languages_created = []
            for lang in languages:
                language_instance  = Languages.objects.get(
                    id=lang['value'], category_id=category_id
                )
                languages_created.append(language_instance)

            doc_software_created = []
            for doc_soft in doc_software:
                doc_software_instance = DocSoftware.objects.get(
                    id=doc_soft['value'], category_id=category_id
                )
                doc_software_created.append(doc_software_instance)

            specialties_created = []
            for speciality in specialties:
                speciality_instance  = Speciality.objects.get(
                    id=speciality['value'], category_id=category_id
                )
                specialties_created.append(speciality_instance)

            facility.fac_wrk_setting.set(work_settings_created)
            facility.fac_discipline.set(disciplines_created)
            facility.fac_langs.set(languages_created)
            facility.fac_doc_soft.set(doc_software_created)
            facility.fac_speciality.set(specialties_created)
            facility.save()

            response = {
                "Status": {
                    "Code": "Success"
                },
                "Result": "Facility created successfully",
                "ID":facility.id,
                "Email": facility.fac_email
            }
            return Response(response, status=status.HTTP_201_CREATED)

        except Exception as e:
            error_response = {
                "Status": {
                    "Code": "Fail"
                },
                "Result": str(e)
            }
            return Response(error_response, status=status.HTTP_400_BAD_REQUEST)



class GetFacility(ListAPIView):

    serializer_class = FacilitySerializers
    permission_classes  = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def get(self, request, *args, **kwags):
        try:
            fac_email = request.GET.get('FacEmail')

            try:
                fac = Facility.objects.get(fac_email = fac_email)
            except Facility.DoesNotExist:
                raise Exception("Data not Found")

            langs = []
            for language in fac.get_fac_languages():
                langs.append(language.id)
            
            specialities = []
            for speciality in fac.get_fac_specialities():
                specialities.append(speciality.id)
            
            docsofts = []
            for docsoft in fac.get_fac_doc_softwares():
                docsofts.append(docsoft.id)

            disciplines = []
            for discipline in fac.get_fac_disciplines():
                disciplines.append(discipline.id)
            
            work_settings = []
            for work_setting in fac.get_fac_work_settings():
                work_settings.append(work_setting.id)

            serializer = self.serializer_class(fac)
            facility = serializer.data
            
            facility['id'] = fac.id
            facility['Languages'] = langs
            facility['Speciality'] = specialities
            facility['DocSoft'] = docsofts
            facility['Discipline'] = disciplines
            facility['Work_Setting'] = work_settings

            response = {
                "Status":{
                    "Code":"Success"
                },
                "Result" : "Facility Retrived successfully",
                "data"   : facility
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
        
class GetFacilities(APIView):
    serializer_class = FacilitySerializers
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
            keyword          = request.data.get("Keyword",None)
            zipcode          = request.data.get("ZipCode",None)

            facilities = Facility.objects.all().order_by('-created')
            
            #Search by options 
            if languages:
                search_filters["fac_langs__in"] = [lang['value'] for lang in languages]
            
            if doc_software:
                search_filters["fac_doc_soft__in"] = [software['value'] for software in doc_software]
            
            if work_setting:
                search_filters["fac_wrk_setting__in"] = [work['value'] for work in work_setting]
        
            if discipline:
                search_filters["fac_discipline__in"] = [disp['value'] for disp in discipline]
        
            if speciality:
                search_filters["fac_speciality__in"] = [spl['value'] for spl in speciality]
            
            if zipcode:
                search_filters["fac_zipcode"] = zipcode

            print("search_filters :",search_filters)

            if search_filters:
                facilities = facilities.filter(**search_filters)

            #Search by keyword
            if keyword:
                facilities = facilities.filter(
                    Q(fac_first_name__icontains=keyword) | Q(fac_last_name__icontains=keyword)
                )
            
            total_records = facilities.count()
            if current_page and records_per_page:

                if not isinstance(current_page, int):
                    raise Exception('Current page is invalid')

                if not isinstance(records_per_page, int):
                    raise Exception('Records per page is invalid')

                indexOfFirstItem = (current_page - 1) * records_per_page
                indexOfLastItem =  indexOfFirstItem + records_per_page
                facilities = facilities[indexOfFirstItem:indexOfLastItem]
            
            result_data = []
            for fac in facilities:
                langs = [language.id for language in fac.get_fac_languages()]
                specialities = [speciality.id for speciality in fac.get_fac_specialities()]
                docsofts = [docsoft.id for docsoft in fac.get_fac_doc_softwares()]
                disciplines = [discipline.id for discipline in fac.get_fac_disciplines()]
                work_settings = [work_setting.id for work_setting in fac.get_fac_work_settings()]

                serializer = self.serializer_class(fac)
                facility_data = serializer.data

                facility_data['id'] = fac.id
                facility_data['Languages'] = langs
                facility_data['Speciality'] = specialities
                facility_data['DocSoft'] = docsofts
                facility_data['Discipline'] = disciplines
                facility_data['Work_Setting'] = work_settings
                facility_data['Created'] = fac.created

                result_data.append(facility_data)

            response = {
                "Status": {
                    "Code": "Success"
                },
                "Result": "All facilities retrieved successfully",
                "data": result_data,
                "CurrentPage":current_page,
                "RecordsPerPage":records_per_page,
                "TotalCount":total_records,
                "Languages":languages,
                "Software" :doc_software,
                "WorkSetting":work_setting,
                "Discipline":discipline,
                "Speciality":speciality,
                "ZipCode":zipcode,
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


class UpdateFacility(UpdateAPIView):
    serializer_class = FacilitySerializers
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def put(self, request, email, *args, **kwargs):
        try:

            try:
                facility = Facility.objects.get(fac_email=email)
            except Facility.DoesNotExist:
                raise Exception("Data not found")

            work_settings = request.data.get('Work_Setting', [])
            disciplines = request.data.get('Discipline', [])
            languages = request.data.get('Languages', [])
            doc_software = request.data.get('DocSoft', [])
            specialties = request.data.get('Speciality', [])

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
                    id =work_setting, category_id=category_id
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

            facility.fac_wrk_setting.set(work_settings_created)
            facility.fac_discipline.set(disciplines_created)
            facility.fac_langs.set(languages_created)
            facility.fac_doc_soft.set(doc_software_created)
            facility.fac_speciality.set(specialties_created)
            facility.save()

            serializer = self.get_serializer(facility, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            facility_data = serializer.save()
           
            response = {
                "Status": {
                    "Code": "Success"
                },
                "Result": "Facility updated successfully",
                "id": facility_data.fac_email
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


class GetSearchProf(CreateAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            print("GetSearchProf", request.data)
            prof_data    = []
            keyword      = request.data.get('keyword',None)
            zipcode      = request.data.get('prof_zip_primary',None)
            years_in     = request.data.get('prof_years_in',None)
            disciplines  = request.data.get('prof_discipline', None)
            langs        = request.data.get('prof_langs', None)
            specialties  = request.data.get('prof_speciality', None)
            wrk_setting  = request.data.get('prof_wrk_setting', None)
            doc_software = request.data.get('prof_doc_soft', None)
            weekly_aval  = request.data.get('prof_weekly_aval', None)
            start_date   = request.data.get('start_date', None)
            end_date     = request.data.get('end_date', None) 
            job_id       = request.data.get('job_id',None)
            
            if job_id:
                try:
                    int(job_id)
                except:
                    raise Exception("Invalid JobID")
            
            filters = {}
            if disciplines:
                filters['prof_discipline__in'] = disciplines
            
            if langs:
                filters['prof_langs__in'] = langs
            
            if specialties:
                filters['prof_speciality__in'] = specialties
            
            if years_in:
                filters['prof_years_in__in'] = years_in
            
            if weekly_aval:
                filters['prof_weekly_aval__in'] = weekly_aval
            
            if wrk_setting:
                filters['prof_work_settings__in'] = wrk_setting
            
            if doc_software:
                filters['prof_doc_soft__in'] = doc_software
            
            if zipcode:
                radius_10_zip = zipcodes(zipcode)
                filters['prof_address_zip__in'] = radius_10_zip
            
            keyword_query = Q()
            if keyword:
                keyword_query = (
                    Q(prof_first_name__icontains=keyword) | 
                    Q(prof_middle_name__icontains=keyword) | 
                    Q(prof_last_name__icontains=keyword)
                )
            
            if start_date and end_date:
                available_professionals_list = ProfessionalSlots.objects.filter(date__range=[start_date, end_date],status="Available").values_list('professional', flat=True).distinct()
                filters['id__in'] = available_professionals_list

            print("prof-search-filters", filters)
            if filters:
                prof_data = Professional.objects.filter(keyword_query,**filters,prof_ref_verify='Closed',prof_status='Active')
                print("professional search data", prof_data)
            if len(prof_data)> 0:
                if job_id:
                    slots = []
                    work_hours = JobWorkHours.objects.filter(job=job_id)
                    if work_hours.exists():
                        slots = work_hours.values_list('slot',flat=True)
                        slot_dates = work_hours.values_list('date', flat=True)
                        professional_available = ProfessionalSlots.objects.filter(professional__in=prof_data,slot__in=slots,date__in = slot_dates, status="Available").values_list('professional', flat=True).distinct()
                        print("professional_available", professional_available)
                        prof_data = Professional.objects.filter(id__in = professional_available)
                        print("professional_available_data", prof_data)
                    else:
                        prof_data = []
                else:
                    prof_data = prof_data
            
            result_count = 0
            prof_ids     = []
            data_array   = []
            if len(prof_data)> 0:
                result_count = prof_data.count()
                prof_ids = prof_data.values_list('id', flat=True)
                
                for data in prof_data:

                    is_job_requested = False
                    if job_id:
                        prof_request = JobProfessionalRequest.objects.filter(professional = data, job__id=job_id)
                        if prof_request.exists():
                            is_job_requested = True
                    
                    languages = [language.id for language in data.get_prof_languages()]
                    specialities = [speciality.id for speciality in data.get_prof_specialities()]
                    docsofts = [docsoft.id for docsoft in data.get_prof_doc_softwares()]
                    disciplines = [discipline.id for discipline in data.get_prof_disciplines()]
                    work_settings = [work_setting.id for work_setting in data.get_prof_work_settings()]
                    
                    prof_data_val = {
                        "id":data.id,
                        "first_name":data.prof_first_name,
                        "last_name":data.prof_last_name,
                        "email" : data.prof_email,
                        "license":data.prof_license,
                        "Ein_number":data.prof_ein_number,
                        "weekly_aval":data.prof_weekly_aval,
                        "state":data.prof_state,
                        "country":data.prof_cntry,
                        "zipcode":data.prof_zip_primary,
                        "experience":data.prof_years_in,
                    }

                    if job_id:
                        prof_data_val["job_request_sent"] = is_job_requested

                    prof_data_val['discipline'] = disciplines
                    prof_data_val['speciality'] = specialities
                    prof_data_val['docsoft'] = docsofts
                    prof_data_val['work_setting'] = work_settings
                    prof_data_val['language'] = languages

                    data_array.append(prof_data_val)

            response = {
                "Status": {
                    "Code": "Success",
                    "Result": "Professional retrived successfully"
                },
                "count":result_count,
                "prof_ids":prof_ids,
                "data" : data_array
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


class CreateFacSearch(CreateAPIView):
    serializer_class = FacilitySearchSerializers
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            print("CreateFacSearch",request.data)
            serializer = self.get_serializer(data=request.data, many=isinstance(request.data, list))
            serializer.is_valid(raise_exception=True)
            fac_search = serializer.save()

            response = {
                "Status": {
                    "Code": "Success"
                },
                "Result": "search data created successfully",
                "SearchID":fac_search.id
            }
            return Response(response, status=status.HTTP_201_CREATED)

        except Exception as e:
            error_response = {
                "Status": {
                    "Code": "Fail"
                },
                "Result": str(e)
            }
            return Response(error_response, status=status.HTTP_400_BAD_REQUEST)
        


class PreferenceViewSet(viewsets.ModelViewSet):
    queryset = FacilityPreference.objects.all()
    serializer_class = PreferenceSerializers
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = FacilityPreference.objects.all()
        fac_user_id = self.request.query_params.get('FacUserID', None)
        if fac_user_id is not None:
            queryset = queryset.filter(user__id=fac_user_id)
        return queryset
    
    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except ValidationError as e:
            return Response({"detail": e.detail}, status=400)
        

class FacilityHours(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def post(self, request, *args, **kwargs):
        try:
            fac_id     = request.data.get("FacID", None)
            discipline = request.data.get("Discipline", [])

            print("fac_id", fac_id)
            print("discipline", discipline)

            # ID validation
            self._validate_id(fac_id)

            #Job Work Hours
            job_hours_data = self._job_work_hrs(fac_id, discipline)

            #Contract Work Hours
            contract_hours_data = self._contract_work_hrs(fac_id, discipline)

            #Job Request Hours
            request_hours_data = self.__prof__job_request_data(fac_id, discipline)

            #Job Hours
            job_hours = self.__job_hours(fac_id, discipline)

            response = {
                "Status":{
                    "Code":"Success",
                    "Result":"Facility hours retrived successfully"
                },
                "request_hours_data"   : request_hours_data,
                "contract_hours_data"  : contract_hours_data,
                "job_hours_data"       : job_hours_data,
                "job_hours"            : job_hours
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
    

    def _validate_id(self, id):
        if id:
            try:
                int(id)
            except ValueError:
                raise Exception("Invalid FacID, must be an interger")
        else:
            raise Exception("Invalid FacID, must not be empty")
    
    
    def _job_work_hrs(self, id, discipline):

        params = {}
        params['job__facility__id'] = id

        if discipline:
            params['job__discipline__in'] = discipline

        job_works_hours = JobWorkHours.objects.filter(**params)
        
        if job_works_hours.exists():
            work_hour_data = WorkHoursSerializers(job_works_hours,many=True).data
           
            for hours in work_hour_data:
                job = Jobs.objects.get(id=hours['job'])
                job_data = JobSerializers(job).data
                hours['job_data'] = job_data

                facility = Facility.objects.get(id=job_data['facility'])
                fac_data = FacilitySerializers(facility).data
                hours['facility_data'] = fac_data
        
            return work_hour_data
        else:
            return []
    
    def __job_hours(self, id, discipline):

        params = {}
        params['job__facility__id'] = id

        if discipline:
            params['job__discipline__in'] = discipline

        job_hours = JobHours.objects.filter(**params)
        
        if job_hours.exists():
            hour_data = HourSerializers(job_hours,many=True).data
           
            for hours in hour_data:
                job = Jobs.objects.get(id=hours['job'])
                job_data = JobSerializers(job).data
                hours['job_data'] = job_data

                facility = Facility.objects.get(id=job_data['facility'])
                fac_data = FacilitySerializers(facility).data
                hours['facility_data'] = fac_data
        
            return hour_data
        else:
            return []

    
    def _contract_work_hrs(self, id, discipline):
        
        params = {}
        work_hours_data = []
        params['job__facility__id'] = id

        if discipline:
            params['job__discipline__in'] = discipline

        contract = Contract.objects.filter(**params)
        if contract.exists():
            work_hours = ContractHours.objects.filter(contract__in = contract).order_by('-created')

            if work_hours.exists():
                for hours in work_hours:
                    #Professional
                    professional = Professional.objects.get(id=hours.contract.job_request.professional.id)
                    prof_data    = ProfessionalSerializers(professional).data

                    langs = []
                    for language in professional.get_prof_languages():
                        langs.append(language.id)
                    
                    specialities = []
                    for speciality in professional.get_prof_specialities():
                        specialities.append(speciality.id)
                    
                    docsofts = []
                    for docsoft in professional.get_prof_doc_softwares():
                        docsofts.append(docsoft.id)

                    disciplines = []
                    for discipline in professional.get_prof_disciplines():
                        disciplines.append(discipline.id)
                    
                    work_settings = []
                    for work_setting in professional.get_prof_work_settings():
                        work_settings.append(work_setting.id)

                    prof_data['Languages'] = langs
                    prof_data['Speciality'] = specialities
                    prof_data['DocSoft'] = docsofts
                    prof_data['Discipline'] = disciplines
                    prof_data['Work_Setting'] = work_settings

                    #Facility
                    facility      = Facility.objects.get(id=hours.contract.job.facility.id)
                    facility_data = FacilitySerializers(facility).data

                    fac_langs = []
                    for language in facility.get_fac_languages():
                        fac_langs.append(language.id)
                    
                    fac_specialities = []
                    for speciality in facility.get_fac_specialities():
                        fac_specialities.append(speciality.id)
                    
                    fac_docsofts = []
                    for docsoft in facility.get_fac_doc_softwares():
                        fac_docsofts.append(docsoft.id)

                    fac_disciplines = []
                    for discipline in facility.get_fac_disciplines():
                        fac_disciplines.append(discipline.id)
                    
                    fac_work_settings = []
                    for work_setting in facility.get_fac_work_settings():
                        fac_work_settings.append(work_setting.id)

                    facility_data['Languages'] = fac_langs
                    facility_data['Speciality'] = fac_specialities
                    facility_data['DocSoft'] = fac_docsofts
                    facility_data['Discipline'] = fac_disciplines
                    facility_data['Work_Setting'] = fac_work_settings
                    
                    #Jobs
                    job      = Jobs.objects.get(id=hours.contract.job.id)
                    job_data = JobSerializers(job).data

                    data = {
                        'contract': hours.contract.id,
                        'contract_status': hours.contract.status,
                        'date': datetime.strptime(str(hours.job_work_hours.date), "%Y-%m-%d").strftime("%m-%d-%Y"),
                        'slot': hours.job_work_hours.slot.id,
                        'status': hours.job_work_hours.job.status,
                        'professional': prof_data,
                        'facility':facility_data,
                        'job_data':job_data
                    }

                    work_hours_data.append(data)
        
        return work_hours_data

    def __prof__job_request_data(self, id, discipline):
        
        job_request_data = []
        
        params = {}
        params['job__facility__id'] = id

        if discipline:
            params['job__discipline__in'] = discipline

        job_request = JobProfessionalRequest.objects.exclude(status__in = [JobProfessionalRequest.Status.REJECTED, JobProfessionalRequest.Status.NOT_INTERESTED]).filter(job__facility = id).distinct()
        if job_request.exists():
            job_request_data = JobRequestSerializers(job_request, many=True).data
            print("job_request_data",job_request_data)
            for data in job_request_data:
                # Job Data
                job = Jobs.objects.filter(id = data['job'])
                if job.exists():
                    job = job.first()
                    job_data = JobSerializers(job).data
                    data['job_data'] = job_data

                    job_work_hours = JobWorkHours.objects.filter(job = job_data['id'])
                    hours_data = WorkHoursSerializers(job_work_hours, many=True).data
                    data['work_hours'] = hours_data

                    #Facility Data
                    facility = Facility.objects.get(id = job_data['facility'])
                    fac_data = FacilitySerializers(facility).data
                    data['facility_data'] = fac_data
                    
                    #Professional Data
                    professional = Professional.objects.get(id = data["professional"])
                    prof_data = ProfessionalSerializers(professional).data
                    data['professional_data'] = prof_data
        
        return job_request_data


class GetContractProfessionals(ListAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes     = [IsAuthenticated]


    def get(self, request, *args, **kwargs):
        try:
            fac_id = request.GET.get("FacID", None)

            # Professional list
            data = self.___get_prof_list(fac_id)

            response = {
                "Status": {
                    "Code": "Success",
                    "Result": "Professionals retrived successfully"
                },
                
                "data" : data
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
    
    def __validate(self, id):
        if id:
            try:
                int(id)
            except:
                raise Exception("Invalid FacID, must be an interger")
        else:
            raise Exception("Invalid FacID, must not be empty")
    
    def ___get_prof_list(self, id):

        prof_list = []
        
        # Validation
        self.__validate(id)
        professionals = Professional.objects.filter(jobprofessionalrequest__contract__job__facility=id).distinct()
        for prof in professionals:
            data = {
                "id"  :prof.id,
                "name":f"{prof.prof_first_name} {prof.prof_last_name}" 
            }
            prof_list.append(data)
        
        return prof_list
        


class FacilityDocViewSet(viewsets.ModelViewSet):
    queryset = FacilityDocSetting.objects.all()
    serializer_class = FacDocSerializers
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = FacilityDocSetting.objects.all()
        doc_status = self.request.query_params.get('Status', None)
        if doc_status is not None:
            queryset = queryset.filter(status=doc_status)
        return queryset
    
# Dashboard

class FacilityActiveCount(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            fac_id = request.data.get('FacID', None)
            today_date = timezone.now().date()

            print("FacID", fac_id)

            active_job_request = JobProfessionalRequest.objects.filter(job__facility__id = fac_id).distinct()
            active_job_request_count = active_job_request.count()

            active_jobs = Jobs.objects.filter(facility__id = fac_id, status="Active").exclude(id__in = active_job_request.values_list('job', flat=True)).count()
            
            active_contracts = Contract.objects.filter(job__facility__id = fac_id).count()

            today_shifts = ContractHours.objects.filter(job_work_hours__job__facility__id = fac_id, job_work_hours__date = today_date).count()

            response = {
                "Status":{
                    "Code":"Success",
                    "Result":"Facility count retrived successfully"
                },
                "open_jobs"               : active_jobs,
                "in_progess_jobs"         : active_job_request_count,
                "in_progress_contracts"   : active_contracts,
                "today_shifts"            : today_shifts
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


class FacilityTotalCount(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            fac_id = request.data.get('FacID', None)
            filter_type = request.data.get('FilterType')

            date_filter = Q()
            shift_date_filter = Q()
            now = timezone.now()

            if filter_type == "Last7Days":
                start_date = now - timedelta(days=7)
                date_filter = Q(created__date__gte=start_date.date())
                shift_date_filter = Q(job_work_hours__date__gte=start_date.date())
            elif filter_type == "ThisMonth":
                start_of_month = now.replace(day=1)
                date_filter = Q(created__date__gte=start_of_month.date())
                shift_date_filter = Q(job_work_hours__date__gte=start_of_month.date())

            job_request  = JobProfessionalRequest.objects.filter(job__facility__id = fac_id).filter(date_filter).count()
            jobs         = Jobs.objects.filter(facility__id = fac_id).filter(date_filter).count()
            contracts    = Contract.objects.filter(job__facility__id = fac_id).filter(date_filter).count()
            shifts       = ContractHours.objects.filter(contract__job__facility__id = fac_id).filter(shift_date_filter).count()

            response = {
                "Status":{
                    "Code":"Success",
                    "Result":"Facility total count retrived successfully"
                },
                "jobs"         : jobs,
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


class FacilityShifts(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            fac_id = request.data.get('FacID', None)
            filter_type = request.data.get('FilterType')

            date_filter = Q()
            now = timezone.now()

            if filter_type == "Last7Days":
                start_date = now - timedelta(days=7)
                date_filter = Q(job_work_hours__date__gte=start_date.date())
            elif filter_type == "ThisMonth":
                start_of_month = now.replace(day=1)
                date_filter = Q(job_work_hours__date__gte=start_of_month.date())
            
            shifts = ContractHours.objects.filter(contract__job__facility__id = fac_id, status="Active").filter(date_filter).order_by('-created')[:6]
            shift_data = ContractHoursSerializers(shifts, many=True).data

            for shift in shift_data:
                print("shift", shift)
                contract = Contract.objects.filter(id = shift['contract'])
                if contract.exists():
                    contract = contract.first()
                    shift['contract_data'] = ContractSerializers(contract).data

                    professional = Professional.objects.filter(id = contract.job_request.professional.id)
                    if professional.exists():
                        professional = professional.first()
                        prof_data = ProfessionalSerializers(professional).data
                        shift['professional'] = prof_data
                        
                        prof_data['Languages'] = [lang.id for lang in professional.get_prof_languages()]
                        prof_data['Speciality'] = [spec.id for spec in professional.get_prof_specialities()]
                        prof_data['DocSoft'] = [doc.id for doc in professional.get_prof_doc_softwares()]
                        prof_data['Discipline'] = [disc.id for disc in professional.get_prof_disciplines()]
                        prof_data['Work_Setting'] = [ws.id for ws in professional.get_prof_work_settings()]
                    
                    job_work_hours= JobWorkHours.objects.filter(id = shift['job_work_hours'])
                    if job_work_hours.exists():
                        job_wrk_hr_data = WorkHoursSerializers(job_work_hours.first()).data
                        shift['job_wrk_hrs'] = job_wrk_hr_data

                        # slot
                        slot = Slots.objects.filter(id = job_wrk_hr_data['slot'])
                        if slot.exists():
                            slot_data = SlotSerializers(slot.first()).data
                            shift['slots'] = slot_data
                        else:
                            shift['slots'] = None
                        
                    else:
                        shift['job_wrk_hrs'] = None

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



class FacilityNotications(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            combined_messages = []
            fac_user_id = request.data.get('FacUserID', None)
            
            request_messages = JobProfessionalRequestMessages.objects.filter(message_to=fac_user_id, status="New").order_by('-created')[:5]
            contract_messages = ContractMessages.objects.filter(message_to = fac_user_id, status="New").order_by('-created')[:5]

            messages = sorted(chain(request_messages, contract_messages),key=attrgetter('created'),reverse=True)[:5]

            for msg in messages:
                if isinstance(msg, JobProfessionalRequestMessages):
                   message_data = MessageSerailaizers(msg).data
                elif isinstance(msg, ContractMessages):
                    message_data = ContractMessageSerailaizers(msg).data
                
                # Facility 
                try:
                    fac = Facility.objects.get(user__id=message_data["message_to"])
                    message_data["facility"] = FacilitySerializers(fac).data
                except Facility.DoesNotExist:
                    message_data["facility"] = None

                # Professional
                try:
                    prof = Professional.objects.get(user__id=message_data["message_from"])
                    message_data["professional"] = ProfessionalSerializers(prof).data
                except Professional.DoesNotExist:
                    message_data["professional"] = None

                combined_messages.append(message_data)

            response = {
                "Status":{
                    "Code":"Success",
                    "Result":"Facility notifications retrived successfully"
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


class FacilityInvoices(APIView):
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
            fac_id = request.data.get('FacUserID', None)
            
            invoices = Invoices.objects.filter(created_by = fac_id)
            serializer = InvoiceSerializers(invoices, many=True)
            invoice_data = serializer.data

            for data in invoice_data:
                data["professional"] = self.__get_professional(data['professional'])
                data["facility"] = self.__get_facility(data['facility'])
                data["contract"] = self.__get_contract(data['contract'])

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

class FacilityWeeklyShifts(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            fac_id = request.data.get('FacID', None)

            if not fac_id:
                raise Exception("FacID must not be empty")

            # Parse the input date
            input_date = timezone.now().date()

            # Calculate previous week's Monday to Sunday
            current_monday = input_date - timedelta(days=input_date.weekday())
            prev_monday    = current_monday - timedelta(days=7)
            prev_sunday    = prev_monday + timedelta(days=6)

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
                contract__job__facility__id=fac_id,
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

