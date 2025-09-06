from django.shortcuts import render
from .models import JobProfessionalRequest
from .serializers import JobRequestSerializers
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import CreateAPIView,ListAPIView
from rest_framework import status
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework.views import APIView
from jobs.models import Jobs, JobWorkHours, JobHours
from jobs.serializers import JobSerializers, WorkHoursSerializers
from django.db.models import Q
from professional.models import Professional
from facility.models import Facility
from facility.serializers import FacilitySerializers
from professional.serializers import ProfessionalSerializers
# Create your views here.

class CreateJobRequest(CreateAPIView):
    serializer_class = JobRequestSerializers
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data, many=isinstance(request.data, list))
            serializer.is_valid(raise_exception=True)
            job_request = serializer.save()

            response = {
                "Status": {
                    "Code": "Success"
                },
                "Result": "Job request data created successfully",
                "JobRequestID":job_request.id
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


class GetJobRequest(ListAPIView):
    serializer_class = JobRequestSerializers
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        try:
            
            request_id = ""
            request_fields = {}
   
            prof_id = request.GET.get('ProfID', None)
            fac_id = request.GET.get('FacID', None)
            job_id = request.GET.get('JobID',None)
            job_request_id = request.GET.get('RequestID',None)

            print("prof_id",prof_id)

           
            if "ProfID" in request.GET:
                request_id = prof_id
                request_fields['professional__user'] = prof_id
            elif "FacID" in request.GET:
                request_id = fac_id
                request_fields['job__facility__user'] = fac_id
            elif "RequestID" in request.GET:
                request_id = job_request_id
                request_fields['id'] = job_request_id
            else:
                request_id = job_id
                request_fields['job'] = job_id
            
            if request_id:
                try:
                    int(request_id)
                except:
                    raise Exception(f"Invalid {request_id}")
            else:
                raise Exception(f"Invalid {request_id}, must not be empty")
            
            job_req_data = []
            job_req = JobProfessionalRequest.objects.filter(**request_fields)
            print(job_req)
            if job_req.count() > 0:
                for job in job_req:
                    created_by = User.objects.get(id=job.created_by)
                    created_by_user = f"{created_by.first_name} {created_by.last_name}"

                    # Total hours
                    total_request_hours = 0
                    job_work_hours = JobWorkHours.objects.filter(job = job.job.id)
                    if job_work_hours.exists():
                        total_request_hours += job_work_hours.count()
                    
                    job_hours = JobHours.objects.filter(job = job.job.id)
                    if job_hours.exists():
                        total_request_hours += job_hours.count()
                    
                    #Total Pay
                    total_pay = total_request_hours * job.job.pay

                    data = {
                        "id":job.id,
                        "job_id":job.job.id,
                        "job_title":job.job.job_title,
                        "discipline":job.job.discipline.disp_name,
                        "years_of_exp":job.job.years_of_exp,
                        "speciality":job.job.speciality.spl_name,
                        "work_setting":job.job.work_setting.wrk_set_name,
                        "visit_type":job.job.visit_type.visit_name,
                        "languages":job.job.languages.lang_name,
                        "job_type":job.job.job_type.type_name,
                        "start_date":job.job.start_date,
                        "end_date":job.job.end_date,
                        "job_created":job.job.created,
                        "job_pay":job.job.pay,
                        "job_license":job.job.license,
                        "job_cpr_bls":job.job.cpr_bls,
                        "created_on":job.created,
                        "updated_on":job.modified,
                        "created_by":created_by_user,
                        "status":job.status,
                        "contact_person":job.job.contact_person,
                        "address1":job.job.address1,
                        "address2":job.job.address2,
                        "state":job.job.state,
                        "country":job.job.country,
                        "zipcode":job.job.zipcode,
                        "professional_id":job.professional.id,
                        "facility_id":job.job.facility.id,
                        "facility_name": f"{job.job.facility.fac_first_name} {job.job.facility.fac_last_name}",
                        "professional_name": f"{job.professional.prof_first_name} {job.professional.prof_last_name}",
                        "total_request_hours": total_request_hours,
                        "total_pay": total_pay
                    }

                    job_req_data.append(data)

            response = {
                "Status": {
                    "Code": "Success"
                },
                "Result": "Job request retrived successfully",
                "data":job_req_data
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

class GetAllJobRequests(APIView):
    serializer_class = JobRequestSerializers
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            search_filters   =  {}

            #By user
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
            pay              =  request.data.get("Pay",None)
            keyword          =  request.data.get("Keyword",None)

            #Sorting
            sort_field   =  request.data.get("SortField",None)
            sort_order   =  request.data.get("SortOrder",None)

            print("request",request.data)
            job_request = JobProfessionalRequest.objects.all().order_by('-created')

            if prof_id:
                search_filters["professional__user"] = prof_id
    
            if fac_id:
                search_filters["job__facility__user"] = fac_id

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
                search_filters["job__start_date"] = start_date

            if end_date:
                search_filters["job__end_date"] = end_date
            
            if pay:
                search_filters["job__pay"] = pay
            
            print("search_filters",search_filters)

            if search_filters:
                job_request = job_request.filter(**search_filters)

            #Search by keyword
            if keyword:
                keyword = keyword.strip()
                print("keyword", keyword)
                job_request = job_request.filter(
                    Q(job__job_title__icontains=keyword) | Q(job__zipcode__icontains=keyword)
                )
            
            #Sorting
            if sort_field and sort_order:
                sort_order = sort_order['value']
                sort_field = sort_field['value']

                if sort_field not in ['created', 'created_by', 'status']:
                    sort_field = f"job__{sort_field}"
                if sort_order == "desc":
                    sort_field = f"-{sort_field}"
                
                print("sort_field",sort_field)

                job_request = job_request.order_by(sort_field)

            total_records = job_request.count()
            if current_page and records_per_page:

                if not isinstance(current_page, int):
                    raise Exception('Current page is invalid')

                if not isinstance(records_per_page, int):
                    raise Exception('Records per page is invalid')
                
                indexOfFirstItem = (current_page - 1) * records_per_page
                indexOfLastItem =  indexOfFirstItem + records_per_page
                job_request = job_request[indexOfFirstItem:indexOfLastItem]
            
            serializer = self.serializer_class(job_request,many=True)
            job_request_data = serializer.data

            if isinstance(job_request_data, list):
                for data in job_request_data:
                    if data['created_by'] is not None:
                        user = User.objects.get(id=data['created_by'])
                        data['created_by'] = f"{user.first_name} {user.last_name}"
                    else:
                        data['created_by'] = "N/A"
            else:
                data = job_request_data
                if data['created_by'] is not None:
                    user = User.objects.get(id=data['created_by'])
                    data['created_by'] = f"{user.first_name} {user.last_name}"
                else:
                    data['created_by'] = "N/A"

            for index, value in enumerate(job_request_data):
                job = Jobs.objects.get(id=value['job'])
                jobs = JobSerializers(job).data
                job_request_data[index]['job_data'] = jobs

                professional = Professional.objects.get(id = value['professional'])
                professional_data = ProfessionalSerializers(professional).data
                job_request_data[index]['professional'] = professional_data

                facility = Facility.objects.get(id = jobs['facility'])
                facility_data = FacilitySerializers(facility).data
                job_request_data[index]['facility'] = facility_data

                total_request_hours = 0
                job_work_hours = JobWorkHours.objects.filter(job = value['job'])
                if job_work_hours.exists():
                    total_request_hours += job_work_hours.count()
                
                job_hours = JobHours.objects.filter(job = value['job'])
                if job_hours.exists():
                    total_request_hours += job_hours.first().hours
                
                job_request_data[index]['request_hours_count'] = total_request_hours

            response = {
                "Status": {
                    "Code": "Success"
                },
                "Result"        : "Job requests retrived successfully",
                "data"          : job_request_data,
                "CurrentPage"   : current_page,
                "RecordsPerPage": records_per_page,
                "TotalCount"    : total_records,
                "StartDate"     : start_date,
                "EndDate"       : end_date,
                "Discipline"    : discipline,
                "Speciality"    : speciality,
                "WorkSetting"   : work_setting,
                "JobType"       : job_type,
                "Languages"     : language,
                "VisitType"     : visit_type,
                "Zipcode"       : zipcode,
                "Keyword"       : keyword
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
        


class UpdateJobRequestStatus(CreateAPIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def post(self, request, *args, **kwargs):
        try:
            job_request_id = request.data.get('JobRequestID')
            request_status = request.data.get('RequestStatus')

            if not request_status:
                raise Exception("Status must not be empty")

            if job_request_id:
                try:
                    int(job_request_id)
                except:
                    raise Exception(f"Invalid {job_request_id}")
            else:
                raise Exception(f"{job_request_id} must not be empty")

            job_request = JobProfessionalRequest.objects.filter(id=job_request_id)
            if job_request.exists:
                set_status = False
                job_request = job_request.first()
                
                if request_status == "Open":
                    if job_request.status == "New":
                        set_status = True
                else:
                    set_status = True

                if set_status:
                    job_request.status = request_status
                    job_request.save()
            else:
                raise Exception("Status update failed, job request not found")

            print(job_request)  

            response = {
                    "Status": {
                        "Code": "Success"
                    },
                    "Result": "Job request retrived successfully",
                    "data": job_request.id
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


class GetRequestHours(APIView):
    serializer_class = WorkHoursSerializers
    authentication_classes= [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            # id validation
            fac_id = request.data.get("FacID")
            fac_discipline = request.data.get("Discipline")

            self._validate_id(fac_id)

            # Hour Data
            hours_data = self.__hours_data(fac_id, fac_discipline)

            response = {
                "Status": {
                    "Code": "Success"
                },
                "Result": "Job work hours for job request retrived successfully",
                "data": hours_data
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
    
    def __hours_data(self, id, discipline):
        hours_data = []
        
        params = {}
        params ['job__facility'] = id
        if discipline:
            params ['job__discipline__in'] = discipline
        
        job_id_list = JobProfessionalRequest.objects.exclude(status=JobProfessionalRequest.Status.REJECTED).filter(**params).values_list("job", flat=True).distinct()
        if job_id_list:
            job_work_hours = JobWorkHours.objects.filter(job__in = job_id_list)
            hours_data = self.serializer_class(job_work_hours, many=True).data

            if hours_data:
                for data in hours_data:

                    # Job Data
                    job = Jobs.objects.filter(id = data['job'])
                    if job.exists():
                        job = job.first()
                        job_data = JobSerializers(job).data
                        data['job_data'] = job_data

                        #Facility Data
                        facility = Facility.objects.get(id = job_data['facility'])
                        fac_data = FacilitySerializers(facility).data
                        data['facility_data'] = fac_data

                        # Job Professional Request Data    
                        job_request = JobProfessionalRequest.objects.filter(job = job_data['id'])
                        if job_request.exists():
                            job_request_data = JobRequestSerializers(job_request, many=True).data
                            data['job_request_data'] = job_request_data

                            # Professional Data
                            for request_data in job_request_data:
                                professional = Professional.objects.get(id = request_data["professional"])
                                prof_data = ProfessionalSerializers(professional).data
                                request_data['professional_data'] = prof_data
        
        return hours_data


    def _validate_id(self, id):
        if id:
            try:
                int(id)
            except:
                raise Exception("Invalid id, must be integer")
        else:
            raise Exception("Invalid id, must be empty")


# class GetRequestHours(ListAPIView):
#     authentication_classes = [TokenAuthentication]
#     permission_classes = [IsAuthenticated]
#     serializer_class = JobRequestSerializers

#     def get(self, request, id, *args, **kwargs):
#         try:
#             self._validate_id(id)
#             request_data = self.__get_professional_requests(id)

#             response = {
#                 "Status": {
#                     "Code": "Success"
#                 },
#                 "Result": "Job professional requests retrieved successfully",
#                 "data": request_data
#             }
#             return Response(response, status=status.HTTP_200_OK)

#         except Exception as e:
#             return Response({
#                 "Status": {
#                     "Code": "Fail"
#                 },
#                 "Result": str(e)
#             }, status=status.HTTP_400_BAD_REQUEST)

#     def __get_professional_requests(self, facility_id):
        
#         data = []

#         job_ids = Jobs.objects.filter(facility=facility_id).values_list("id", flat=True)

#         job_requests = JobProfessionalRequest.objects.exclude(status=JobProfessionalRequest.Status.REJECTED).filter(job__in=job_ids)

#         if job_requests.exists():
#             serialized_requests = self.serializer_class(job_requests, many=True).data

#             for item in serialized_requests:
#                 job_id = item['job']
#                 professional_id = item['professional']

#                 # Job data
#                 job = Jobs.objects.filter(id=job_id).first()
#                 item['job_data'] = JobSerializers(job).data if job else {}

#                 # Facility data
#                 facility = Facility.objects.filter(id=job.facility).first() if job else None
#                 item['facility_data'] = FacilitySerializers(facility).data if facility else {}

#                 # Professional data
#                 professional = Professional.objects.filter(id=professional_id).first()
#                 item['professional_data'] = ProfessionalSerializers(professional).data if professional else {}

#                 data.append(item)

#         return data

#     def _validate_id(self, id):
#         if not id or not str(id).isdigit():
#             raise Exception("Invalid id, must be an integer")