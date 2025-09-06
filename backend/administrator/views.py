from django.shortcuts import render
from professional.models import Professional, ProfessionalSlots
from professional.serializers import ProfessionalSerializers, ProfSlotSerializers
from facility.models import Facility
from facility.serializers import FacilitySerializers
from rest_framework.generics import CreateAPIView,ListAPIView,UpdateAPIView,DestroyAPIView
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response
from rest_framework import status,viewsets
from django.contrib.auth.models import User
from .serializers import UserSerializers
from contract.models import ContractHours
from contract.serializers import ContractHoursSerializers, ContractSerializers
from django.utils import timezone
from collections import defaultdict
from datetime import timedelta
from django.db.models import Q
from contract.models import Contract, ContractHours
from contract.serializers import ContractHoursSerializers, ContractSerializers
from modules.models import Slots
from modules.serializers import SlotSerializers
from jobs.models import JobWorkHours, Jobs
from jobs.serializers import WorkHoursSerializers, JobSerializers
from invoices.models import Invoices
from invoices.serializers import InvoiceSerializers

# Create your views here.

class GetUsers(ListAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        try:
            user_type   = request.GET.get('UserType',None)
            serializers = None
            user_data   = []
            data        = []

            if user_type:
                if user_type == "Professional":
                    user_data = Professional.objects.all()
                    serializers = ProfessionalSerializers
                else:
                    user_data = Facility.objects.all()
                    serializers = FacilitySerializers
            else:
                raise Exception("Invalid UserType")

            
            if serializers:
                serializer = serializers(user_data,many=True)
                data = serializer.data
            else:
                raise Exception("Invalid serializer defined")

            response = {
                "Status":{
                    "Code":"Success"
                },
                "Result" : f"{user_type} Retrived successfully",
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


class AdminSearch(CreateAPIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            role = request.data.pop('role',None)
            result = []

            def is_empty(fields):
                data_fields = {}
                for key, value in fields.items():
                    if value:
                        data_fields[key] = value
                return data_fields

            if role:
                if role == "Professional":
                    prof_fields = {
                        "prof_first_name": request.data.get("prof_first_name",None),
                        "prof_last_name": request.data.get("prof_last_name",None),
                        "prof_middle_name": request.data.get("prof_middle_name",None),
                        "prof_email": request.data.get("prof_email",None),
                        "prof_address": request.data.get("prof_address",None),
                        "prof_status": request.data.get("prof_status",None),
                        "prof_work_settings__id": request.data.get("prof_work_settings",None),
                        "prof_discipline__id": request.data.get("prof_discipline",None),
                        "prof_speciality__id": request.data.get("prof_speciality",None)
                    }
                    
                    data       = Professional.objects.filter(**is_empty(prof_fields)) if is_empty(prof_fields) else Professional.objects.all()
                    serializer = ProfessionalSerializers
            
                else:
                    fac_fields = {
                        "fac_title": request.data.get("fac_title",None),
                        "fac_business_name": request.data.get("fac_business_name",None),
                        "fac_first_name": request.data.get("fac_first_name",None),
                        "fac_middle_name": request.data.get("fac_middle_name",None),
                        "fac_last_name": request.data.get("fac_last_name",None),
                        "fac_email": request.data.get("fac_email",None),
                        "fac_status": request.data.get("fac_status",None),
                        "fac_discipline__id": request.data.get("fac_discipline",None),
                        "fac_speciality__id": request.data.get("fac_speciality",None)
                    }
                    
                    data       = Facility.objects.filter(**is_empty(fac_fields)) if is_empty(fac_fields) else Facility.objects.all()
                    serializer = FacilitySerializers
                
                if role =="Professional":
                    for prof in data:
                        langs = [language.id for language in prof.get_prof_languages()]
                        specialities = [speciality.id for speciality in prof.get_prof_specialities()]
                        docsofts = [docsoft.id for docsoft in prof.get_prof_doc_softwares()]
                        disciplines = [discipline.id for discipline in prof.get_prof_disciplines()]
                        work_settings = [work_setting.id for work_setting in prof.get_prof_work_settings()]

                        prof_data = serializer(prof).data

                        prof_data['id'] = prof.id
                        prof_data['Languages'] = langs
                        prof_data['Speciality'] = specialities
                        prof_data['DocSoft'] = docsofts
                        prof_data['Discipline'] = disciplines
                        prof_data['Work_Setting'] = work_settings
                        prof_data['Created'] = prof.created

                        result.append(prof_data)
                else:
                    for fac in data:
                        langs = [language.id for language in fac.get_fac_languages()]
                        specialities = [speciality.id for speciality in fac.get_fac_specialities()]
                        docsofts = [docsoft.id for docsoft in fac.get_fac_doc_softwares()]
                        disciplines = [discipline.id for discipline in fac.get_fac_disciplines()]
                        work_settings = [work_setting.id for work_setting in fac.get_fac_work_settings()]

                        fac_data = serializer(fac).data

                        fac_data['id'] = fac.id
                        fac_data['Languages'] = langs
                        fac_data['Speciality'] = specialities
                        fac_data['DocSoft'] = docsofts
                        fac_data['Discipline'] = disciplines
                        fac_data['Work_Setting'] = work_settings
                        fac_data['Created'] = fac.created

                        result.append(fac_data)
                
                response = {
                    "Status": {
                        "Code": "Success"
                    },
                    "Result": f"{role} retrived successfully",
                    "data"  : result
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
        

class AdminUserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializers
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]


class GetTotalCount(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            
            today_date = timezone.now().date()

            facility     = Facility.objects.all().count()
            professional = Professional.objects.all().count()
            shifts       = ContractHours.objects.all().count()
            today_shifts = ContractHours.objects.filter(job_work_hours__date = today_date).count()

            response = {
                "Status":{
                    "Code":"Success",
                    "Result":"Admin total count retrived successfully"
                },
                "facility"     : facility,
                "professional" : professional,
                "shifts"       : shifts,
                "today_shifts" : today_shifts
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


class WeeklyShifts(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
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
            shifts = ContractHours.objects.filter(created__date__range=(prev_monday, prev_sunday)).order_by('-created')

            for shift in shifts:
                shift_serialized = ContractHoursSerializers(shift).data

                # Contract
                contract = shift.contract
                shift_serialized['contract_data'] = ContractSerializers(contract).data

                # Professional
                professional = contract.job_request.professional
                prof_data = ProfessionalSerializers(professional).data

                prof_data['Languages'] = [lang.id for lang in professional.get_prof_languages()]
                prof_data['Speciality'] = [spec.id for spec in professional.get_prof_specialities()]
                prof_data['DocSoft'] = [doc.id for doc in professional.get_prof_doc_softwares()]
                prof_data['Discipline'] = [disc.id for disc in professional.get_prof_disciplines()]
                prof_data['Work_Setting'] = [ws.id for ws in professional.get_prof_work_settings()]

                shift_serialized['professional'] = prof_data

                # Facility
                facility = contract.job.facility
                fac_data = FacilitySerializers(facility).data

                fac_data['Languages'] = [lang.id for lang in facility.get_fac_languages()]
                fac_data['Speciality'] = [spec.id for spec in facility.get_fac_specialities()]
                fac_data['DocSoft'] = [doc.id for doc in facility.get_fac_doc_softwares()]
                fac_data['Discipline'] = [disc.id for disc in facility.get_fac_disciplines()]
                fac_data['Work_Setting'] = [ws.id for ws in facility.get_fac_work_settings()]

                shift_serialized['facility'] = fac_data

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
                    "Result": "Previous week shifts retrieved successfully"
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

class AdminShifts(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes     = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            filter_type = request.data.get('FilterType')

            date_filter = Q()
            now = timezone.now()

            if filter_type == "Last 7 Days":
                start_date = now - timedelta(days=7)
                date_filter = Q(job_work_hours__date__gte=start_date.date())
            elif filter_type == "This Month":
                start_of_month = now.replace(day=1)
                date_filter = Q(job_work_hours__date__gte=start_of_month.date())
            else:
                date_filter = Q(job_work_hours__date=now.date())
            
            shifts = ContractHours.objects.all().filter(date_filter).order_by('-created')[:6]
            shift_data = ContractHoursSerializers(shifts, many=True).data

            for shift in shift_data:
                contract = Contract.objects.filter(id = shift['contract'])
                if contract.exists():
                    contract = contract.first()
                    shift['contract_data'] = ContractSerializers(contract).data

                    # Job    
                    job_data = self.__get_job(contract.job.id)
                    shift['job'] = job_data

                    # Facility
                    fac_data = self.__get_facility(contract.job.facility.id)
                    shift['facility'] = fac_data

                    # Professional
                    prof_data = self.__get_professional(contract.job_request.professional.id)
                    shift['professional'] = prof_data

                    # Professional Slots
                    prof_slot_data = self.__get_prof_slot(shift['professional_slots'])
                    shift['prof_slot'] = prof_slot_data

                    # Slot data of professional slots
                    slot_data = self.__get_slot(prof_slot_data['slot'])
                    shift['prof_slot']['slots'] = slot_data

                    # Job Work hours
                    job_wrk_hr_data = self.__get_job_wrk_hrs(shift['job_work_hours'])
                    shift['job_wrk_hrs'] = job_wrk_hr_data

                    #Slot data of job work hours
                    slot_data = self.__get_slot(job_wrk_hr_data['slot'])
                    shift['job_wrk_hrs']['slots'] = slot_data


            response = {
                "Status":{
                    "Code":"Success",
                    "Result":"Admin shifts retrived successfully"
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
    

    def __get_facility(self, fac_id):
        fac_data = None
        facility = Facility.objects.filter(id =fac_id)
        if facility.exists():
            facility          = facility.first()
            fac_data          = FacilitySerializers(facility).data

            fac_data['Languages']    = [lang.id for lang in facility.get_fac_languages()]
            fac_data['Speciality']   = [spl.id for spl in facility.get_fac_specialities()]
            fac_data['DocSoft']      = [ds.id for ds in facility.get_fac_doc_softwares()]
            fac_data['Discipline']   = [disp.id for disp in facility.get_fac_disciplines()]
            fac_data['Work_Setting'] = [ws.id for ws in facility.get_fac_work_settings()]
        
        return fac_data 
    

    def __get_professional(self, prof_id):
        prof_data = None
        prof = Professional.objects.filter(id = prof_id)
        if prof.exists():
            prof                  = prof.first()
            prof_data             = ProfessionalSerializers(prof).data

            prof_data['Languages']    = [lang.id for lang in prof.get_prof_languages()]
            prof_data['Speciality']   = [spl.id for spl in prof.get_prof_specialities()]
            prof_data['DocSoft']      = [ds.id for ds in prof.get_prof_doc_softwares()]
            prof_data['Discipline']   = [disp.id for disp in prof.get_prof_disciplines()]
            prof_data['Work_Setting'] = [ws.id for ws in prof.get_prof_work_settings()]
        
        return prof_data


    def __get_prof_slot(self, prof_slot_id):
        prof_slot_data = None
        prof_slot = ProfessionalSlots.objects.filter(id = prof_slot_id)
        if prof_slot.exists():
            prof_slot_data     = ProfSlotSerializers(prof_slot.first()).data

        return prof_slot_data

    def __get_job_wrk_hrs(self, job_hrs_id):
        job_wrk_hr_data = None
        job_work_hours= JobWorkHours.objects.filter(id = job_hrs_id)
        if job_work_hours.exists():
            job_wrk_hr_data = WorkHoursSerializers(job_work_hours.first()).data

        return job_wrk_hr_data

    def __get_slot(self, slot_id):
        slot_data = None
        slot = Slots.objects.filter(id = slot_id)
        if slot.exists():
            slot_data = SlotSerializers(slot.first()).data
        
        return slot_data

    def __get_job(self, job_id):
        job_data = None
        job = Jobs.objects.filter(id = job_id)
        if job.exists():
            job = job.first()
            job_data = JobSerializers(job).data
        
        return job_data


class AdminInvoices(APIView):
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
            invoices = Invoices.objects.all().order_by('-created')[:5]
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
                    "Result":"Admin invoices retrived successfully"
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
