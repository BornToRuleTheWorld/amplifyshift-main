from django.shortcuts import render
from rest_framework.generics import CreateAPIView,ListAPIView,UpdateAPIView
from .serializers import *
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response
from rest_framework import status
from .models import ContractHours, Contract
from jobs.models import JobWorkHours
from facility.models import Facility
from professional.models import Professional
from rest_framework.views import APIView
from django.contrib.auth.models import User
from datetime import datetime
from django.db.models import Q
from professional.models import ProfessionalSlots, ProfessionalHours
from jobs.models import Jobs, JobHours
from jobs.serializers import JobSerializers
from facility.serializers import FacilitySerializers
from professional.serializers import ProfessionalSerializers
from job_request.models import JobProfessionalRequest
from contract_messages.models import ContractMessages
from django.db import transaction
from modules.models import Slots
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.db.models import Count, F, ExpressionWrapper, FloatField, Sum

# Create your views here.

class CreateContract(CreateAPIView):
    serializer_class = ContractSerializers
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def post(self, request, *args, **kwargs):
        try:
            data = request.data
            contract_exists = Contract.objects.filter(**data)
            if contract_exists.exists():
                raise Exception("Contract already exists")
            else:
                job_work_hours = JobWorkHours.objects.filter(job=data['job'])

                if job_work_hours.exists():    
                    serializer = self.serializer_class(data=data, many=isinstance(data, list))
                    serializer.is_valid(raise_exception=True)
                    contract = serializer.save()
                    job_work_hours = JobWorkHours.objects.filter(job=contract.job)
                    if job_work_hours.exists():
                        for work_hours in job_work_hours:
                            professional_slots = ProfessionalSlots.objects.filter(professional=contract.job_request.professional,date=work_hours.date, slot=work_hours.slot, status="Available")
                            if professional_slots.exists():
                                for prof_slot in professional_slots:
                                    ContractHours.objects.create(contract=contract,job_work_hours=work_hours,professional_slots=prof_slot)
                                    prof_slot.status = "Booked"
                                    prof_slot.save()
                    
                    response = {
                        "Status": {
                            "Code": "Success"
                        },
                        "Result": "Contract created successfully",
                        "ContractID":contract.id,
                    }
                    return Response(response, status=status.HTTP_201_CREATED)
                
                else:
                    raise Exception("Shifts for this contract does not exists")

        except Exception as e:
            error_response = {
                "Status": {
                    "Code": "Fail"
                },
                "Result": str(e)
            }
            return Response(error_response, status=status.HTTP_400_BAD_REQUEST)

class GetContract(ListAPIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def get(self, request, *args, **kwargs):
        try:
            contract_fields = {}
            contract_id     = request.GET.get('ContractID',None)
            job_id          = request.GET.get('JobID',None)

            if contract_id:
                try:
                    int(contract_id)
                except:
                    raise Exception("Invalid contract id")
                
                contract_fields['id'] = contract_id
            
            elif job_id:
                try:
                    int(job_id)
                except:
                    raise Exception("Invalid job id")
                contract_fields['job'] = job_id
            
            else:
                raise Exception("Invalid data, ID must be empty")
            
            
            contact_data = []
            contract = Contract.objects.filter(**contract_fields)
            if contract.exists():
                for con_data in contract:
                    professional = Professional.objects.get(id=con_data.job_request.professional_id)
                    created_by_user = User.objects.get(id=con_data.created_by)
                    contract_hours = ContractHours.objects.filter(contract=con_data)
                    data = {
                        "id":con_data.id,
                        "job_id":con_data.job.id,
                        "job_title":con_data.job.job_title,
                        "job_request_id":con_data.job_request.id,
                        "contract_no":con_data.contract_no,
                        "start_date":con_data.start_date,
                        "end_date":con_data.end_date,
                        "discipline":con_data.job.discipline.disp_name,
                        "years_of_exp":con_data.job.years_of_exp,
                        "speciality":con_data.job.speciality.spl_name,
                        "work_setting":con_data.job.work_setting.wrk_set_name,
                        "visit_type":con_data.job.visit_type.visit_name,
                        "languages":con_data.job.languages.lang_name,
                        "job_type":con_data.job.job_type.type_name,
                        "job_start_date":con_data.job.start_date,
                        "job_end_date":con_data.job.end_date,
                        "job_contact_person":con_data.job.contact_person,
                        "job_address1":con_data.job.address1,
                        "job_address2":con_data.job.address2,
                        "job_state":con_data.job.state,
                        "job_country":con_data.job.country,
                        "job_zipcode":con_data.job.zipcode,
                        "job_pay":con_data.job.pay,
                        "job_license":con_data.job.license,
                        "job_cpr_bls":con_data.job.cpr_bls,
                        "job_created":con_data.job.created,
                        "created_on":con_data.created,
                        "updated_on":con_data.modified,
                        "created_by":f"{created_by_user.first_name} {created_by_user.last_name}",
                        "status":con_data.status,
                        "professional_id":professional.id,
                        "professional_name":f"{professional.prof_first_name} {professional.prof_last_name}",
                        "facility_id":con_data.job.facility.id,
                        "contract_hours":contract_hours.count()
                    }

                    contact_data.append(data)
            response = {
                "Status": {
                    "Code": "Success"
                },
                "Result": "Contract retrived successfully",
                "data":contact_data
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
                

class GetContracts(ListAPIView):
    serializer_class = ContractSerializers
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def get(self, request, *args, **kwargs):
        try:
            role = request.GET.get('Role')
            fac_id = request.GET.get('facUserID')
            prof_id = request.GET.get('profUserID')

            data = []
            contract_fields = {}
            if role == "facility":
                if fac_id:
                    try:
                        int(fac_id)
                    except:
                        raise Exception("Invalid Facility ID")  

                    fac_data = Facility.objects.filter(user=fac_id)
                    if fac_data.exists():
                        contract_fields['job__facility'] = fac_data.first()
                    else:
                        raise Exception("Invalid facility")
                else:
                    raise Exception("Facility id must not be empty")

            else:
                if prof_id:
                    try:
                        int(prof_id)
                    except:
                        raise Exception("Invalid Professional ID")

                    prof_data = Professional.objects.filter(user=prof_id)
                    if prof_data.exists():
                        contract_fields['job_request__professional_id'] = prof_data.first().id
                    else:
                        raise Exception("Invalid Professional")
                else:
                    raise Exception("Professional id must not be empty")
            
            contact_data = []
            contract = Contract.objects.filter(**contract_fields)
            if contract.exists():
                for con_data in contract:
                    professional = Professional.objects.get(id=con_data.job_request.professional_id)
                    created_by_user = User.objects.get(id=con_data.created_by)
                    data = {
                        "id":con_data.id,
                        "job_id":con_data.job.id,
                        "job_title":con_data.job.job_title,
                        "job_request_id":con_data.job_request.id,
                        "start_date":con_data.start_date,
                        "end_date":con_data.end_date,
                        "discipline":con_data.job.discipline.disp_name,
                        "years_of_exp":con_data.job.years_of_exp,
                        "speciality":con_data.job.speciality.spl_name,
                        "work_setting":con_data.job.work_setting.wrk_set_name,
                        "visit_type":con_data.job.visit_type.visit_name,
                        "languages":con_data.job.languages.lang_name,
                        "job_type":con_data.job.job_type.type_name,
                        "job_start_date":con_data.job.start_date,
                        "job_end_date":con_data.job.end_date,
                        "job_contact_person":con_data.job.contact_person,
                        "job_address1":con_data.job.address1,
                        "job_address2":con_data.job.address2,
                        "job_state":con_data.job.state,
                        "job_country":con_data.job.country,
                        "job_zipcode":con_data.job.zipcode,
                        "job_pay":con_data.job.pay,
                        "job_license":con_data.job.license,
                        "job_cpr_bls":con_data.job.cpr_bls,
                        "job_created":con_data.job.created,
                        "created_on":con_data.created,
                        "updated_on":con_data.modified,
                        "created_by":f"{created_by_user.first_name} {created_by_user.last_name}",
                        "status":con_data.status,
                        "professional_id":professional.id,
                        "professional_name":f"{professional.prof_first_name} {professional.prof_last_name}",
                        "facility_id":con_data.job.facility.id
                    }

                    contact_data.append(data)
        
            response = {
                "Status": {
                    "Code": "Success"
                },
                "Result": "Contract retrived successfully",
                "data":contact_data,
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

class GetAllContracts(APIView):
    serializer_class       = ContractSerializers
    permission_classes     = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def post(self, request, *args, **kwargs):
        try:
            search_filters   = {}
            contact_data     = []
            current_page     =  request.data.get("CurrentPage",None)
            records_per_page =  request.data.get("RecordsPerPage",None)
            start_date       =  request.data.get("StartDate",None)
            end_date         =  request.data.get("EndDate",None)
            discipline       =  request.data.get("Discipline",[])
            speciality       =  request.data.get("Speciality",[])
            work_setting     =  request.data.get("WorkSetting",[])
            job_type         =  request.data.get("JobType",[])
            language         =  request.data.get("Languages",[])
            visit_type       =  request.data.get("VisitType",[])
            zipcode          =  request.data.get("ZipCode",[])
            keyword          =  request.data.get("Keyword",None)

            contract = Contract.objects.all().order_by('-created')

            if language:
                search_filters["job__languages__in"] = [lang['value'] for lang in language]
            
            if job_type:
                search_filters["job__job_type__in"] = [type['value'] for type in job_type]
            
            if work_setting:
                search_filters["job__work_setting__in"] = [work['value'] for work in work_setting]
        
            if discipline:
                search_filters["job__discipline__in"] = [disp['value'] for disp in discipline]
        
            if speciality:
                search_filters["job__speciality__in"] = [spl['value'] for spl in speciality]
            
            if visit_type:
                search_filters["job__visit_type__in"] = [visit['value'] for visit in visit_type]
            
            if zipcode:
                search_filters["job__zipcode"] = zipcode
 
            if start_date:
                search_filters["start_date"] = start_date

            if end_date:
                search_filters["end_date"] = end_date

            if search_filters:
                contract = Contract.objects.filter(**search_filters)
            
            if keyword:
                contract = contract.filter(
                    Q(job__job_title__icontains=keyword)
                )
            
            total_records = contract.count()
            if current_page and records_per_page:

                if not isinstance(current_page, int):
                    raise Exception('Current page is invalid')

                if not isinstance(records_per_page, int):
                    raise Exception('Records per page is invalid')
                
                indexOfFirstItem = current_page - 1
                indexOfLastItem  =  indexOfFirstItem + records_per_page
                contract         = contract[indexOfFirstItem:indexOfLastItem]
            
            if contract.exists():
                for con_data in contract:
                    professional = Professional.objects.get(id=con_data.job_request.professional.id)
                    created_by_user = User.objects.get(id=con_data.created_by)
                    data = {
                        "id":con_data.id,
                        "job_id":con_data.job.id,
                        "job_title":con_data.job.job_title,
                        "job_request_id":con_data.job_request.id,
                        "start_date":con_data.start_date,
                        "end_date":con_data.end_date,
                        "discipline":con_data.job.discipline.disp_name,
                        "years_of_exp":con_data.job.years_of_exp,
                        "speciality":con_data.job.speciality.spl_name,
                        "work_setting":con_data.job.work_setting.wrk_set_name,
                        "visit_type":con_data.job.visit_type.visit_name,
                        "languages":con_data.job.languages.lang_name,
                        "job_type":con_data.job.job_type.type_name,
                        "job_start_date":con_data.job.start_date,
                        "job_end_date":con_data.job.end_date,
                        "job_contact_person":con_data.job.contact_person,
                        "job_address1":con_data.job.address1,
                        "job_address2":con_data.job.address2,
                        "job_state":con_data.job.state,
                        "job_country":con_data.job.country,
                        "job_contact":con_data.job.contact_phone,
                        "job_zipcode":con_data.job.zipcode,
                        "job_pay":con_data.job.pay,
                        "job_license":con_data.job.license,
                        "job_cpr_bls":con_data.job.cpr_bls,
                        "job_created":con_data.job.created,
                        "created_on":con_data.created,
                        "updated_on":con_data.modified,
                        "created_by":f"{created_by_user.first_name} {created_by_user.last_name}",
                        "status":con_data.status,
                        "professional_id":professional.id,
                        "professional_name":f"{professional.prof_first_name} {professional.prof_last_name}",
                        "facility_id":con_data.job.facility.id,
                        "facility_name":f"{con_data.job.facility.fac_first_name} {con_data.job.facility.fac_last_name}"
                    }

                    contact_data.append(data)
        
            response = {
                "Status": {
                    "Code": "Success"
                },
                "Result": "Contract retrived successfully",
                "data":contact_data,
                "CurrentPage":current_page,
                "RecordsPerPage":records_per_page,
                "TotalCount":total_records,
                "StartDate" : start_date,
                "EndDate" : end_date,
                "Discipline" : discipline,
                "Speciality": speciality,
                "WorkSetting" : work_setting,
                "JobType" : job_type,
                "Languages" : language,
                "VisitType" : visit_type,
                "Zipcode" : zipcode,
                "Keyword" : keyword
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

class GetAllContract(APIView):
    serializer_class       = ContractSerializers
    permission_classes     = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def post(self, request, *args, **kwargs):
        try:
            search_filters   = {}
            fac_id           =  request.data.get("FacID",None)
            prof_id          =  request.data.get("ProfID",None)

            #Pagination
            current_page     =  request.data.get("CurrentPage",None)
            records_per_page =  request.data.get("RecordsPerPage",None)

            #Search
            start_date       =  request.data.get("StartDate",None)
            end_date         =  request.data.get("EndDate",None)
            discipline       =  request.data.get("Discipline",[])
            speciality       =  request.data.get("Speciality",[])
            work_setting     =  request.data.get("WorkSetting",[])
            job_type         =  request.data.get("JobType",[])
            language         =  request.data.get("Languages",[])
            visit_type       =  request.data.get("VisitType",[])
            zipcode          =  request.data.get("ZipCode",[])
            keyword          =  request.data.get("Keyword",None)

            #Sorting
            sort_field   =  request.data.get("SortField",None)
            sort_order   =  request.data.get("SortOrder",None)

            contract = Contract.objects.all().order_by('-created')

            if prof_id:
                search_filters['job_request__professional__user'] = prof_id
            
            if fac_id:
                search_filters['job__facility__user'] = fac_id

            if language:
                search_filters["job__languages__in"] = [lang['value'] for lang in language]
            
            if job_type:
                search_filters["job__job_type__in"] = [type['value'] for type in job_type]
            
            if work_setting:
                search_filters["job__work_setting__in"] = [work['value'] for work in work_setting]
        
            if discipline:
                search_filters["job__discipline__in"] = [disp['value'] for disp in discipline]
        
            if speciality:
                search_filters["job__speciality__in"] = [spl['value'] for spl in speciality]
            
            if visit_type:
                search_filters["job__visit_type__in"] = [visit['value'] for visit in visit_type]
            
            if zipcode:
                search_filters["job__zipcode"] = zipcode
 
            if start_date:
                search_filters["start_date"] = start_date

            if end_date:
                search_filters["end_date"] = end_date

            if search_filters:
                contract = Contract.objects.filter(**search_filters)
            
            if keyword:
                contract = contract.filter(
                    Q(job__job_title__icontains=keyword)
                )
            #Sorting
            if sort_field and sort_order:
                sort_order = sort_order['value']
                sort_field = sort_field['value']

                if sort_field not in ['created', 'created_by', 'status', 'start_date','end_date']:
                    sort_field = f"job__{sort_field}"
                if sort_order == "desc":
                    sort_field = f"-{sort_field}"
                
                print("sort_field",sort_field)

                contract = contract.order_by(sort_field)
            
            total_records = contract.count()
            if current_page and records_per_page:

                if not isinstance(current_page, int):
                    raise Exception('Current page is invalid')

                if not isinstance(records_per_page, int):
                    raise Exception('Records per page is invalid')
                
                indexOfFirstItem = (current_page - 1) * records_per_page
                indexOfLastItem  =  indexOfFirstItem + records_per_page
                contract         = contract[indexOfFirstItem:indexOfLastItem]
            
            serializer = self.serializer_class(contract,many=True)
            contract_data = serializer.data

            if isinstance(contract_data, list):
                for data in contract_data:
                    if data['created_by'] is not None:
                        user = User.objects.get(id=data['created_by'])
                        data['created_by'] = f"{user.first_name} {user.last_name}"
                    else:
                        data['created_by'] = "N/A"
            else:
                data = contract_data
                if data['created_by'] is not None:
                    user = User.objects.get(id=data['created_by'])
                    data['created_by'] = f"{user.first_name} {user.last_name}"
                else:
                    data['created_by'] = "N/A"

            for index, value in enumerate(contract_data):
                job = Jobs.objects.get(id=value['job'])
                job_request = JobProfessionalRequest.objects.get(id=value['job_request'])
                jobs = JobSerializers(job).data
                contract_data[index]['job_data'] = jobs
                contract_data[index]['facility_id'] = job.facility.id
                contract_data[index]['professional_id'] = job_request.professional.id
                contract_data[index]['facility_name'] = f"{job.facility.fac_first_name} {job.facility.fac_last_name}"
                contract_data[index]['professional_name'] = f"{job_request.professional.prof_first_name} {job_request.professional.prof_last_name}"
        
            response = {
                "Status": {
                    "Code": "Success"
                },
                "Result": "Contract retrived successfully",
                "data":contract_data,
                "CurrentPage":current_page,
                "RecordsPerPage":records_per_page,
                "TotalCount":total_records,
                "StartDate" : start_date,
                "EndDate" : end_date,
                "Discipline" : discipline,
                "Speciality": speciality,
                "WorkSetting" : work_setting,
                "JobType" : job_type,
                "Languages" : language,
                "VisitType" : visit_type,
                "Zipcode" : zipcode,
                "Keyword" : keyword
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

class UpdateContract(UpdateAPIView):
    serializer_class = ContractSerializers
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def put(self, request, id, *args, **kwargs):
        try:

            if id is not None:
                try:
                    con_id = int(id)
                except ValueError:
                    raise Exception("Invalid contract id")
            else:
                raise Exception("Contract id must not be empty")

            try:
                job = Contract.objects.get(id=con_id)
            except Contract.DoesNotExist:
                raise Exception("Data not found")

            serializer = self.get_serializer(job, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            con_data = serializer.save()
           
            response = {
                "Status": {
                    "Code": "Success"
                },
                "Result": "Job updated successfully",
                "id": con_data.id
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


class SearchContract(APIView):
    serializer_class = ContractSerializers
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            contract_fields = {}
            contract_data = []
            data = []
            role = request.data.get("role",None)
            fac_id = request.data.get("fac_id",None)
            prof_id = request.data.get("prof_id",None)
            start_date = request.data.get("start_date", None)
            end_date = request.data.get("end_date",None)

            if (start_date and not end_date) or (not start_date and end_date):
                raise Exception("Please select both dates")
            
            if end_date and start_date:
                
                end_date = end_date.split("T")[0]
                start_date = start_date.split("T")[0]

                contract_fields['date__range'] = [start_date,end_date]
                contract_fields['status'] = "New"

                if role == "facility":
                    if fac_id:
                        try:
                            int(fac_id)
                        except:
                            raise Exception("Invalid Facility ID")  

                        fac_data = Facility.objects.filter(user=fac_id)
                        if fac_data.exists():
                            contract_fields['job__facility'] = fac_data.first()
                        else:
                            raise Exception("Invalid facility")
                    else:
                        raise Exception("Facility id must not be empty")

                else:
                    if prof_id:
                        try:
                            int(prof_id)
                        except:
                            raise Exception("Invalid Professional ID")

                        prof_data = Professional.objects.filter(user=prof_id)
                        if prof_data.exists():
                            contract_fields['job_request__professional_id'] = prof_data.first().id
                        else:
                            raise Exception("Invalid Professional")
                    else:
                        raise Exception("Professional id must not be empty")
                

                contract = Contract.objects.filter(**contract_fields)
                if contract.exists():
                    data = contract
            
            serializer = self.serializer_class(data, many=True)
            contract_data = serializer.data
            
            response = {
                    "Status": {
                        "Code": "Success"
                    },
                    "Result": "Contract retrived successfully",
                    "data": contract_data
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

class GetContractHours(ListAPIView):
    serializer_class = ContractHoursSerializers
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        try:
            con_id = request.GET.get("ConID", None)

            try:
                int(con_id)
            except:
                raise Exception("Invalid Contract ID")
            
            work_hours = []
            contract = Contract.objects.filter(id = con_id)
            if contract.exists():
                work_hours = ContractHours.objects.filter(contract = contract.first()).order_by('-created')
            else:
                raise Exception("Contract not found")

            work_hours_data = []
            for hours in work_hours:
                data = {
                    'contract':hours.contract.id,
                    'date':datetime.strptime(str(hours.job_work_hours.date), "%Y-%m-%d").strftime("%m-%d-%Y"),
                    'slot': hours.job_work_hours.slot.id,
                    'status':hours.job_work_hours.job.status,
                    'type': hours.job_work_hours.slot.slot_type,
                }

                work_hours_data.append(data)
                
            response = {
                "Status": {
                    "Code": "Success"
                },
                "Result": "Contract Work Hours retrived successfully",
                "data": work_hours_data
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


class GetUserContractHours(APIView):
    serializer_class = ContractHoursSerializers
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            user_field         = {}
            hours_fields       = {}
            total_records      = 0
            prof_id            = request.data.get("ProfID", None)
            fac_id             = request.data.get("FacID",None)
            hour_status        = request.data.get("Status",None)
            discipline         = request.data.get("Discipline",None)
            start_date         = request.data.get("StartDate",None)
            end_date           = request.data.get("EndDate",None)
            con_prof_id        = request.data.get("ConProfID",None)
            current_page       = request.data.get('CurrentPage',None)
            records_per_page   = request.data.get('RecordsPerPage',None)
            keyword            = request.data.get('Keyword',None)
            con_search_id      = request.data.get('ContractID',None)
            con_search_options = []

            if prof_id:
                prof_id = int(prof_id)
                if isinstance(prof_id,int):
                    user_field['job_request__professional__id'] = prof_id
                else:
                    raise Exception("ProfID is invalid")
            
            if fac_id:
                fac_id = int(fac_id)
                if isinstance(fac_id,int):
                    user_field['job__facility__id'] = fac_id
                else:
                    raise Exception("FacID is invalid")
            
            if discipline:
                user_field['job__discipline__in'] = discipline
            
            if start_date:
                user_field['start_date'] = start_date
            
            if end_date:
                user_field['end_date'] = end_date

            if fac_id and con_prof_id:
                con_prof_id = int(con_prof_id)
                if isinstance(con_prof_id,int):
                    user_field['job_request__professional__id'] = con_prof_id
                else:
                    raise Exception("ProfID is invalid")
            
            if con_search_id:
                con_search_id = int(con_search_id)
                if isinstance(con_search_id,int):
                    user_field['id__in'] = [con_search_id]
                else:
                    raise Exception("ContractID is invalid")
            
            work_hours_data = []
            contract = Contract.objects.filter(**user_field).order_by('-created')
            
            if contract.exists():

                #contracts
                hours_fields['contract__in'] = contract
                
                #Keyword 
                if keyword:
                    contract = contract.filter(Q(contract_no__icontains=keyword))

                #status
                if hour_status and hour_status != "All":
                    hours_fields['status'] = hour_status
                else:
                    hours_fields['status__in'] = ['Active', 'Inactive']

                work_hours = ContractHours.objects.filter(**hours_fields).order_by('created')
                if work_hours.exists():
                    wrk_hrs_contracts = Contract.objects.filter(id__in = work_hours.values_list('contract',flat=True).distinct())
                    
                    # Search options for frontend
                    for items in wrk_hrs_contracts:
                        data = {
                            "value": items.id,
                            "label": f"{items.contract_no} - {items.job_request.professional.prof_first_name} {items.job_request.professional.prof_last_name}"
                        }
                        con_search_options.append(data)

                    #Pagination
                    total_records = work_hours.count()
                    if current_page and records_per_page:

                        if not isinstance(current_page, int):
                            raise Exception('Current page is invalid')

                        if not isinstance(records_per_page, int):
                            raise Exception('Records per page is invalid')
                        
                        paginator = Paginator(work_hours, records_per_page)

                        try:
                            work_hours = paginator.page(current_page)
                        except PageNotAnInteger:
                            work_hours = paginator.page(1)
                        except EmptyPage:
                            work_hours = paginator.page(paginator.num_pages)

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
                        
                        #Jobs
                        job      = Jobs.objects.get(id=hours.contract.job.id)
                        job_data = JobSerializers(job).data

                        data = {
                            'contract': hours.contract.id,
                            'slot_id':hours.id,
                            'date': datetime.strptime(str(hours.job_work_hours.date), "%Y-%m-%d").strftime("%m-%d-%Y"),
                            'slot': hours.job_work_hours.slot.id,
                            'slot_type': hours.job_work_hours.slot.slot_type,
                            'status': hours.status,
                            'professional': prof_data,
                            'facility':facility_data,
                            'job':job_data
                        }

                        work_hours_data.append(data)
                
            response = {
                "Status": {
                    "Code": "Success"
                },
                "Result": "Contract Work Hours retrived successfully",
                "data": work_hours_data,
                "current_page":current_page,
                "records_per_page":records_per_page,
                "total_count":total_records,
                "con_search_options": con_search_options
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
        
class GetAllContractHours(APIView):
    serializer_class = ContractHoursSerializers
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            search_filters   = {} 
            current_page     = request.data.get('CurrentPage',None)
            records_per_page = request.data.get('RecordsPerPage',None)
            start_date       = request.data.get('StartDate',None)
            shift_status     = request.data.get('ShiftStatus',None)

            contract_hours = ContractHours.objects.all().order_by('-created')

            if start_date:
                search_filters['job_work_hours__date'] = start_date
            
            if shift_status:
                search_filters['job_work_hours__job__status'] = shift_status
            
            if search_filters:
                contract_hours = contract_hours.filter(**search_filters)
            
            total_records = contract_hours.count()
            if current_page and records_per_page:

                if not isinstance(current_page, int):
                    raise Exception('Current page is invalid')

                if not isinstance(records_per_page, int):
                    raise Exception('Records per page is invalid')

                indexOfFirstItem = current_page - 1
                indexOfLastItem  =  indexOfFirstItem + records_per_page
                contract_hours   = contract_hours[indexOfFirstItem:indexOfLastItem]
            
            result_data = []
            for hours in contract_hours:
                data = {
                    'contract':hours.contract.id,
                    'date':datetime.strptime(str(hours.job_work_hours.date), "%Y-%m-%d").strftime("%m-%d-%Y"),
                    'slot': hours.job_work_hours.slot.id,
                    'status':hours.job_work_hours.job.status
                }
                result_data.append(data)
            
            response = {
                "Status": {
                    "Code": "Success"
                },
                "Result": "All contract hours retrieved successfully",
                "data": result_data,
                "CurrentPage":current_page,
                "RecordsPerPage":records_per_page,
                "TotalCount":total_records
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

class SearchContractHours(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            contract_data = ContractHours.objects.all()
            start_date = request.data.get("start_date", None)
            end_date = request.data.get("end_date",None)

            if (start_date and not end_date) or (not start_date and end_date):
                raise Exception("Please select both dates")
            
            con_hours_data = []
            if end_date and start_date:
                end_date = end_date.split("T")[0]
                start_date = start_date.split("T")[0]
                con_hours = ContractHours.objects.filter(job_work_hours__date__range=[start_date,end_date])
                if con_hours.exists():
                    for hours in con_hours:
                        data = {
                            'contract':hours.contract.id,
                            'date':datetime.strptime(hours.job_work_hours.date, "%Y-%m-%d").strftime("%m-%d-%Y"),
                            'slot': hours.job_work_hours.slot.id,
                            'status':hours.job_work_hours.job.status
                        }

                        con_hours_data.append(data)
            
            contract_data = con_hours_data
            
            response = {
                    "Status": {
                        "Code": "Success"
                    },
                    "Result": "ContractHours retrived successfully",
                    "data": contract_data
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
        

class ContractWorkHourStatus(APIView):
    serializers_class = ContractHoursSerializers
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            request_user_id = request.user.pk
            hour_id = request.data.get('HourID')
            user_type = request.data.get('UserType')            
            hours_status = request.data.get('HourStatus')

            # Validation
            valid_hour_id = self.__validate(hour_id,user_type,hours_status)

            # status update
            data = self.__update_status(valid_hour_id, user_type, request_user_id, hours_status)

            response = {
                    "Status": {
                        "Code": "Success"
                    },
                    "Result": "Contract Hour updated successfully",
                    "data": data
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

    
    def __validate(self, id, type, status):

        # Ids 
        if id:
            id = id if isinstance(id,list) else [id]
        else:
            raise Exception("ID must not be empty")
        # User type
        if not type:
            raise Exception("UserType must not be empty")

        #Status
        if not status:
            raise Exception("Status must not be empty")
        
        return id
        
    
    def __update_status(self,ids, user_type, request_user_id, hours_status):
        success = []
        failed  = []
        for id in ids:
            try:
                id = int(id)
                contract_hours = ContractHours.objects.filter(id=id)
                if contract_hours.exists():
                    hours = contract_hours.first()
                    hours.status = hours_status
                    hours.cancel_user_type = user_type
                    hours.cancelled_on = datetime.now().date()
                    
                    # For job work hours
                    job_wrk_hrs = JobWorkHours.objects.get(id = hours.job_work_hours.id)
                    job_wrk_hrs.status = JobWorkHours.Status.AVAILABLE
                    job_wrk_hrs.save()

                    # For professional slots
                    prof_slot = ProfessionalSlots.objects.get(id = hours.professional_slots.id)
                    prof_slot.status = ProfessionalSlots.Status.AVAILABLE
                    prof_slot.save()
                                
                    hours.save()

                    slot_type = hours.job_work_hours.slot.slot_type
                    self.__notify_user_for_slots(id, user_type, request_user_id, slot_type, hours_status)    
                    success.append({"id": id, "success":"Status updated successfully"})
                else:
                    failed.append({"id": id, "error":"Data not found"})
            except Exception as e:
                failed.append({"id": id, "error":str(e)})
    
        return {
            "success":success,
            "failed":failed
        }

    def __notify_user_for_slots(self,id, user_type, request_user_id, slot_type, hours_status):
        
        contract_hours = ContractHours.objects.filter(id=id)
        
        if contract_hours.exists():
            contract_hours = contract_hours.first()
            professional = Professional.objects.get(id = contract_hours.professional_slots.professional.id)
            facility = Facility.objects.get(id = contract_hours.job_work_hours.job.facility.id)
            contract_id = contract_hours.contract
            if user_type == "Professional":
                if slot_type == "Slots":
                    start_hr = contract_hours.professional_slots.slot.start_hr.strftime('%I:%M %p')
                    end_hr = contract_hours.professional_slots.slot.end_hr.strftime('%I:%M %p')
                    slot_name = f'{start_hr} - {end_hr}'
                else:
                    slot_name = "1 hr"
                
                date = datetime.strptime(str(contract_hours.professional_slots.date),"%Y-%m-%d").strftime("%m-%d-%Y")
                message_from_id = professional.user.pk
                message_to_id = facility.user.pk
                user_name = f'{professional.prof_first_name} {professional.prof_last_name}'
                
            else:
                if slot_type == "Slots":
                    start_hr = contract_hours.job_work_hours.slot.start_hr.strftime('%I:%M %p')
                    end_hr = contract_hours.job_work_hours.slot.end_hr.strftime('%I:%M %p')
                    slot_name = f'{start_hr} - {end_hr}'
                else:
                    slot_name = "1 hr"
                date = datetime.strptime(str(contract_hours.job_work_hours.date),"%Y-%m-%d").strftime("%m-%d-%Y")
                message_from_id = facility.user.pk
                message_to_id = professional.user.pk
                user_name = f'{facility.fac_first_name} {facility.fac_last_name}'
                

            contract_message = ContractMessages.objects.create(
                contract = contract_id,
                message_from = message_from_id,
                message_to = message_to_id,
                message = f'Shift on {date} {slot_name} was {"cancelled" if hours_status == "Cancelled" else "marked as completed"} by {user_name}',
                status = "New",
                created_by = request_user_id
            )

            print("contract_message", contract_message)
        
        else:
            raise Exception("Invalid id record does not exists")


class BillableContractHours(APIView):
    serializer_class = ContractHoursSerializers
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            user_field         = {}
            hours_fields       = {}
            total_records      = 0
            prof_id            = request.data.get("ProfID", None)
            fac_id             = request.data.get("FacID",None)
            discipline         = request.data.get("Discipline",None)
            start_date         = request.data.get("StartDate",None)
            end_date           = request.data.get("EndDate",None)
            con_prof_id        = request.data.get("ConProfID",None)
            current_page       = request.data.get('CurrentPage',None)
            records_per_page   = request.data.get('RecordsPerPage',None)
            keyword            = request.data.get('Keyword',None)
            con_search_id      = request.data.get('ContractID',None)
            con_search_options = []

            print("start_date",start_date)
            print("start_date",end_date)

            if prof_id:
                prof_id = int(prof_id)
                if isinstance(prof_id,int):
                    user_field['job_request__professional__id'] = prof_id
                else:
                    raise Exception("ProfID is invalid")
            
            if fac_id:
                fac_id = int(fac_id)
                if isinstance(fac_id,int):
                    user_field['job__facility__id'] = fac_id
                else:
                    raise Exception("FacID is invalid")
            
            if discipline:
                user_field['job__discipline__in'] = discipline

            if fac_id and con_prof_id:
                con_prof_id = int(con_prof_id)
                if isinstance(con_prof_id,int):
                    user_field['job_request__professional__id'] = con_prof_id
                else:
                    raise Exception("ProfID is invalid")
            
            if con_search_id:
                con_search_id = int(con_search_id)
                if isinstance(con_search_id,int):
                    user_field['id__in'] = [con_search_id]
                else:
                    raise Exception("ContractID is invalid")
            
            work_hours_data = []
            contracts = Contract.objects.filter(**user_field).order_by('-created')
            
            if contracts.exists():

                #contracts
                hours_fields['contract__in'] = contracts
                hours_fields['status'] = "Completed"

                #Keyword 
                if keyword:
                    contracts = contracts.filter(Q(contract_no__icontains=keyword))

                work_hours = ContractHours.objects.filter(**hours_fields).values('contract', 'contract__job_request__professional').annotate(professional = F('contract__job_request__professional'), facility = F('contract__job__facility'), job = F('contract__job'), total_hours=Count('id'), total_amount=ExpressionWrapper(F('contract__job__pay') * Count('id'),output_field=FloatField())).order_by('contract','contract__job_request__professional')
                if work_hours.exists():

                    if start_date and end_date:
                        work_hours = work_hours.filter(job_work_hours__date__range = [start_date, end_date])
                    
                    # Search options for frontend
                    wrk_hrs_contracts = Contract.objects.filter(id__in = work_hours.values_list('contract',flat=True).distinct())
                    for items in wrk_hrs_contracts:
                        data = {
                            "value": items.id,
                            "label": f"{items.contract_no} - {items.job_request.professional.prof_first_name} {items.job_request.professional.prof_last_name}"
                        }
                        con_search_options.append(data)

                    #Pagination
                    total_records = work_hours.count()
                    if current_page and records_per_page:

                        if not isinstance(current_page, int):
                            raise Exception('Current page is invalid')

                        if not isinstance(records_per_page, int):
                            raise Exception('Records per page is invalid')
                        
                        paginator = Paginator(work_hours, records_per_page)

                        try:
                            work_hours = paginator.page(current_page)
                        except PageNotAnInteger:
                            work_hours = paginator.page(1)
                        except EmptyPage:
                            work_hours = paginator.page(paginator.num_pages)

                    for hours in work_hours:
                        # Professional
                        professional = Professional.objects.get(id=hours['professional'])
                        prof_data    = ProfessionalSerializers(professional).data

                        # Facility
                        facility = Facility.objects.get(id=hours['facility'])
                        facility_data = FacilitySerializers(facility).data

                        # Job
                        job = Jobs.objects.get(id=hours['job'])
                        job_data = JobSerializers(job).data

                        #Contract
                        contract = Contract.objects.get(id=hours['contract'])
                        contract_data = ContractSerializers(contract).data

                        data = {
                            'contract_id': hours['contract'],
                            'professional_id': hours['professional'],
                            'facility_id': hours['facility'],
                            'job_id': hours['job'],
                            'total_hours': hours['total_hours'],
                            'total_amount': hours['total_amount'],
                            'professional': prof_data,
                            'facility': facility_data,
                            'job': job_data,
                            'contract':contract_data
                        }

                        work_hours_data.append(data)

                
            response = {
                "Status": {
                    "Code": "Success"
                },
                "Result": "Contract Work Hours retrived successfully",
                "data": work_hours_data,
                "current_page":current_page,
                "records_per_page":records_per_page,
                "total_count":total_records,
                "con_search_options": con_search_options
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



class GetInvoiceCreateHrs(APIView):
    serializer_class = ContractHoursSerializers
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def post(self, request, *args, **kwargs):
        try:
            con_id     = request.data.get("ConID", None)
            prof_id    = request.data.get("ProfID", None)
            start_date = request.data.get("StartDate", None)
            end_date   = request.data.get("EndDate", None)

            # Validate Input
            self.__validate_input(con_id, prof_id, start_date, end_date)

            # Contract hours data    
            data = self.__get_contract_hours(con_id, prof_id, start_date, end_date)

            response = {
                "Status": {
                    "Code": "Success"
                },
                "Result": "Contract Work Hours retrived successfully",
                "data": data,
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

    def __get_contract_hours(self, con_id, prof_id, start_date, end_date):
        
        con_hrs_data = []
        
        contract = Contract.objects.filter(id = con_id)
        if contract.exists():
            con_hrs = ContractHours.objects.filter(contract__id = con_id, contract__job_request__professional = prof_id,  job_work_hours__date__range = [start_date, end_date], status = "Completed")
            
            total_hours = con_hrs.count()
            hourly_rate = contract.first().job.pay
            total_amount = total_hours * hourly_rate

            for hours in con_hrs:
                data = {
                    'contract':hours.contract.id,
                    'date':datetime.strptime(str(hours.job_work_hours.date), "%Y-%m-%d").strftime("%m-%d-%Y"),
                    'slot': hours.job_work_hours.slot.id,
                    'status':hours.status
                }

                con_hrs_data.append(data)

            con_hrs_data.append({
                'total_hours': total_hours,
                'total_amount': total_amount
            })
        
        return con_hrs_data

    
    def __validate_input(self, id, prof_id, start_date, end_date):
        
        self.__validate_id(id, "contract")
        
        self.__validate_id(prof_id, "professional")

        if not start_date:
            raise Exception("Invalid start_date, must not be empty")
        
        if not end_date:
            raise Exception("Invalid end_date, must not be empty")
    
    
    def __validate_id(self, id, name):

        if id:
            try:
                int(id)
            except:
                raise Exception(f"Invalid {name} id, must be an integer")
        else:
            raise Exception(f"Invalid {name} id, must not be empty")

