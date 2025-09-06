from django.shortcuts import render
from .models import *
from .serializers import *
from rest_framework.generics import CreateAPIView,ListAPIView,UpdateAPIView,DestroyAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response
from rest_framework import status 
from django.contrib.auth.models import User
from datetime import datetime
from rest_framework.views import APIView
from django.db.models import Q
from rest_framework import viewsets
from job_request.models import JobProfessionalRequest
from job_request_messages.models import JobProfessionalRequestMessages
from django.db.models import Count
from jobs.models import Jobs
# Create your views here.
class CreateJobs(CreateAPIView):
    serializer_class = JobSerializers
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data, many=isinstance(request.data, list))
            serializer.is_valid(raise_exception=True)
            job = serializer.save()

            response = {
                "Status": {
                    "Code": "Success"
                },
                "Result": "Job created successfully",
                "JobID":job.id
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


class GetJobs(ListAPIView):
    serializer_class = JobSerializers
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
       
        try:
            fac_id = request.GET.get("FacID",None)
            job_id = request.GET.get("JobID",None)
            method = request.GET.get("method",None)
            many   = False

            if fac_id is not None:
                try:
                    fac_id = int(fac_id)
                except ValueError:
                    raise Exception("Invalid FacID")

            if job_id is not None:
                try:
                    job_id = int(job_id)
                except ValueError:
                    raise Exception("Invalid JobID")

            if method == "all":
                user_data = User.objects.get(id=fac_id)
                jobs = Jobs.objects.filter(facility__user=fac_id).order_by('-created')
                many = True
            else:
                try:
                    jobs = Jobs.objects.get(id=job_id)
                except Jobs.DoesNotExist:
                    raise Exception("No jobs found")

            serializer = self.serializer_class(jobs,many=many)
            job = serializer.data

            if isinstance(job, list):
                for data in job:
                    if data['created_by'] is not None:
                        user = User.objects.get(id=data['created_by'])
                        data['created_by'] = f"{user.first_name} {user.last_name}"
                    else:
                        data['created_by'] = "N/A"

                    data['contract_created'] = False
                    job_request = JobProfessionalRequest.objects.filter(job__id = data['id'], status="Contract Created")
                    if job_request.exists():
                        data['contract_created'] = True
                
            else:
                data = job
                if data['created_by'] is not None:
                    user = User.objects.get(id=data['created_by'])
                    data['created_by'] = f"{user.first_name} {user.last_name}"
                else:
                    data['created_by'] = "N/A"

                data['contract_created'] = False
                job_request = JobProfessionalRequest.objects.filter(job__id = data['id'], status="Contract Created")
                if job_request.exists():
                    data['contract_created'] = True

            response = {
                "Status": {
                    "Code": "Success"
                },
                "Result": "Job retrived successfully",
                "data": job
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
        
class GetAllJobs(APIView):
    serializer_class = JobSerializers
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            search_filters   =  {}

            #By user
            fac_id           =  request.data.get("FacID",None)

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

            jobs = Jobs.objects.all().order_by('-created')
    
            if fac_id:
                search_filters["facility__user"] = fac_id

            if language:
                search_filters["languages__in"] = [lang['value'] for lang in language]
            
            if job_type:
                search_filters["job_type__in"] = [type['value'] for type in job_type]
            
            if work_setting:
                search_filters["work_setting__in"] = [work['value'] for work in work_setting]
        
            if discipline:
                search_filters["discipline__in"] = [disp['value'] for disp in discipline]
        
            if speciality:
                search_filters["speciality__in"] = [spl['value'] for spl in speciality]
            
            if visit_type:
                search_filters["visit_type__in"] = [visit['value'] for visit in visit_type]
            
            if zipcode:
                search_filters["zipcode"] = zipcode
 
            if start_date:
                search_filters["start_date"] = start_date

            if end_date:
                search_filters["end_date"] = end_date
            
            if pay:
                search_filters["pay"] = pay
            
            if search_filters:
                jobs = jobs.filter(**search_filters)

            #Search by keyword
            if keyword:
                jobs = jobs.filter(
                    Q(job_title__icontains=keyword)
                )
            
            #Sorting
            if sort_field and sort_order:
                sort_order = sort_order['value']
                sort_field = sort_field['value']
                if sort_order == "desc":
                    sort_field = f"-{sort_field}"
                
                jobs = jobs.order_by(sort_field)

            total_records = jobs.count()
            if current_page and records_per_page:

                if not isinstance(current_page, int):
                    raise Exception('Current page is invalid')

                if not isinstance(records_per_page, int):
                    raise Exception('Records per page is invalid')
                
                indexOfFirstItem = (current_page - 1) * records_per_page
                indexOfLastItem =  indexOfFirstItem + records_per_page
                jobs = jobs[indexOfFirstItem:indexOfLastItem]

            serializer = self.serializer_class(jobs,many=True)
            job = serializer.data

            if isinstance(job, list):
                for data in job:
                    if data['created_by'] is not None:
                        user = User.objects.get(id=data['created_by'])
                        data['created_by'] = f"{user.first_name} {user.last_name}"
                    else:
                        data['created_by'] = "N/A"
                    
                    data['contract_created'] = False
                    job_request = JobProfessionalRequest.objects.filter(job__id = data['id'], status="Contract Created")
                    if job_request.exists():
                        data['contract_created'] = True
            else:
                data = job
                if data['created_by'] is not None:
                    user = User.objects.get(id=data['created_by'])
                    data['created_by'] = f"{user.first_name} {user.last_name}"
                else:
                    data['created_by'] = "N/A"
                
                data['contract_created'] = False
                job_request = JobProfessionalRequest.objects.filter(job__id = data['id'], status="Contract Created")
                if job_request.exists():
                    data['contract_created'] = True

            response = {
                "Status": {
                    "Code": "Success"
                },
                "Result": "Jobs retrived successfully",
                "data": job,
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

class UpdateJobs(UpdateAPIView):
    serializer_class = JobSerializers
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def put(self, request, id, *args, **kwargs):
        try:

            if id is not None:
                try:
                    job_id = int(id)
                except ValueError:
                    raise Exception("Invalid job id")
            else:
                raise Exception("Invalid job id, must not be empty")

            try:
                job = Jobs.objects.get(id=job_id)
            except Jobs.DoesNotExist:
                raise Exception("Data not found")

            job_request = JobProfessionalRequest.objects.filter(job__id = job_id, status="Contract Created")
            if job_request.exists():
                raise Exception("Contract has been created to this job updated cannot be done")

            serializer = self.get_serializer(job, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            job_data = serializer.save()
           
            response = {
                "Status": {
                    "Code": "Success"
                },
                "Result": "Job updated successfully",
                "id": job_data.id
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


class DeleteJobs(DestroyAPIView):
    serializer_class = JobSerializers
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def destroy(self, request, id, *args, **kwargs):
        try:
            if id is not None:
                try:
                    job_id = int(id)
                except ValueError:
                    raise Exception("Invalid job id")
            else:
                raise Exception("Job id must not be empty")

            jobs = Jobs.objects.filter(id=job_id)
            if jobs.count() > 0:
                self.perform_destroy(jobs.first())
            else:
                raise Exception("Data not found")
            
            response = {
                "Status": {
                    "Code": "Success"
                },
                "Result": "Job deleted successfully",
                "id": job_id
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


class CreateJobWorkHours(CreateAPIView):
    serializer_class = WorkHoursSerializers
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        print("WorkHours", request.data)
        try:
            converted_data = []
            date_slot_map = {}

            if isinstance(request.data, list):
                # Date convertion to YYYY-MM-DD
                convert_date = lambda date_string: datetime.strptime(date_string, '%m/%d/%Y').strftime('%Y-%m-%d')

                for request_data in request.data:
                    date = convert_date(request_data['date'])
                    job_id = request_data.get('job')
                    slots = request_data.get('slot')
                    hours = request_data.get('hours')

                    if hours:
                        slot_list = Slots.objects.filter(slot_type="Hour_slots").values_list('id', flat=True)[:hours]
                    else:
                        slot_list = slots if isinstance(slots, list) else [slots] if slots else []

                    key = (date, job_id)
                    if key not in date_slot_map:
                        date_slot_map[key] = set()
                    date_slot_map[key].update(slot_list)

                    for slot in slot_list:
                        exists = JobWorkHours.objects.filter(date=date, slot=slot, job=job_id).exists()
                        if not exists:
                            work_hour_data = request_data.copy()
                            work_hour_data['date'] = date
                            work_hour_data['slot'] = slot
                            converted_data.append(work_hour_data)
            
            print("date_slot_map",date_slot_map)
            # Delete any slots not re-submitted for each (date, job)
            for (date, job_id), submitted_slots in date_slot_map.items():
                existing_slots = JobWorkHours.objects.filter(date=date, job=job_id)
                for wh in existing_slots:
                    if wh.slot.id not in submitted_slots:
                        wh.delete()
            
            if converted_data:
                serializer = self.get_serializer(data=converted_data, many=True)
                serializer.is_valid(raise_exception=True)
                job_work_hours = serializer.save()
                work_hour_ids = [work_hour.id for work_hour in job_work_hours]
            else:
                work_hour_ids = []

            response = {
                "Status": {"Code": "Success"},
                "Result": "Job Work Hours processed successfully",
                "CreatedWorkHours": work_hour_ids
            }
            return Response(response, status=status.HTTP_201_CREATED)

        except Exception as e:
            print("Error processing Job Work Hours:", str(e))
            return Response({
                "Status": {"Code": "Success"},
                "Result": str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

        
class GetJobWorkHours(ListAPIView):
    serializer_class = WorkHoursSerializers
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        try:
            work_hours_data = []
            job_id    = request.GET.get("JobID", None)
            slot_type = request.GET.get("Type", None)

            # Input validation
            self.__validate_input(job_id,slot_type)
            
            # Job exists validation 
            jobs = Jobs.objects.filter(id = job_id)
            if jobs.exists():
                job = jobs.first()
                work_hours_data = self.__get_slot_data(slot_type, job)
            else:
                raise Exception("Job not found")
            
            print("work_hours_data", work_hours_data)

            response = {
                "Status": {
                    "Code": "Success"
                },
                "Result": "Job Work Hours retrived successfully",
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
    
    def __validate_input(self, job_id, slot_type):

        # JobID
        try:
            int(job_id)
        except:
            raise Exception("Invalid JobID")

        # Slot type
        if not slot_type:
            raise Exception("Slot type must not be empty")
    
    def __get_slot_data(self, slot_type, job):
        
        slot_data      = []
        hour_slot_data = []
        all_slots_data = []

        work_hours_by_slots      = JobWorkHours.objects.filter(job = job, slot__slot_type = "Slots").order_by('-created')
        work_hours_by_hour_slots = JobWorkHours.objects.filter(job = job, slot__slot_type = "Hour_slots").values('job', 'date', 'status').annotate(hours=Count('slot')).order_by('-date')

        if work_hours_by_slots.exists():
            for hours in work_hours_by_slots:
                data = {
                        'id':hours.id,
                        'job_id':hours.job.id,
                        'date':datetime.strptime(str(hours.date),"%Y-%m-%d").strftime("%m-%d-%Y"),
                        'status':hours.status,
                        'slot':hours.slot.id,
                        'type':"Slots"
                    }
                slot_data.append(data)

        if work_hours_by_hour_slots.exists():
            for hours in work_hours_by_hour_slots:
                data = {
                        'job_id':hours['job'],
                        'date':datetime.strptime(str(hours['date']),"%Y-%m-%d").strftime("%m-%d-%Y"),
                        'status':hours['status'],
                        'hours':hours['hours'],
                        'type':"Hour_slots"
                    }
                hour_slot_data.append(data)
        
        if slot_type == "Slots":
            return slot_data
        elif slot_type == "Hour_slots":
            return hour_slot_data
        else:
            all_slots_data = slot_data + hour_slot_data
            return all_slots_data
            
class DeleteJobWorkHours(APIView):
    serializer_class = WorkHoursSerializers
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        try:
            ids        = request.data.get("HourID", None)
            ids =  ids if  isinstance(ids, list) else [ids]

            deleted_ids = []
            failed_ids = []

            for id in ids:
                try:
                    id = int(id)
                    job_work_hours = JobWorkHours.objects.filter(id=id).first()                 
                    if job_work_hours:
                        job_work_hours.delete()
                        self.__notify_user(job_work_hours, request.user.pk)
                        deleted_ids.append(id)
                    else:
                        failed_ids.append({"id": id, "error": "Data not found"})
                except Exception as e:
                    failed_ids.append({"id": id, "error": str(e)})

            response = {
                "Status": {
                    "Code": "Partial Success" if failed_ids else "Success"
                },
                "Deleted": deleted_ids,
                "Failed": failed_ids
            }

            return Response(response, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                "Status": {
                    "Code": "Fail"
                },
                "Result": str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

    
    def __notify_user(self, job_work_hours, request_user_id):
        
        work_hours = job_work_hours
        facility = Facility.objects.get(id = work_hours.job.facility)
        job_request = JobProfessionalRequest.objects.filter(job=work_hours.job)

        for request in job_request:
            start_hr = work_hours.slot.start_hr.strftime('%I:%M %p')
            end_hr = work_hours.slot.end_hr.strftime('%I:%M %p')
            hours = f'{start_hr} - {end_hr}'
            date = datetime.strptime(str(work_hours.date),"%Y-%m-%d").strftime("%m-%d-%Y")
            message_from_id = facility.user.pk
            message_to_id = request.professional.user.pk
            user_name = f'{facility.fac_first_name} {facility.fac_last_name}'
            

            JobProfessionalRequestMessages.objects.create(
            contract = request.id,
            message_from = message_from_id,
            message_to = message_to_id,
            message = f'Shift on {date} {hours} was deleted by {user_name}',
            status = "New",
            created_by = request_user_id
        )

class DeleteJobHours(APIView):
    serializer_class = WorkHoursSerializers
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        try:
            request_data = request.data
           
            # Convert single dict to list
            if isinstance(request_data, dict):
                request_data = [request_data]

            deleted_ids = []
            failed_items = []

            for item in request_data:
                job_id = item.get("JobID")
                date = item.get("SlotDate")
                hours = item.get("SlotHours")

                if not job_id or not date or not hours:
                    failed_items.append({"item": item, "error": "JobID, SlotDate, and SlotHours are required."})
                    continue

                try:
                    if isinstance(date, str):
                        date = datetime.strptime(date, "%Y-%m-%d").date()

                    slot_list = Slots.objects.filter(slot_type='Hour_slots').values_list('id', flat=True)

                    job_work_hours_qs = JobWorkHours.objects.filter(
                        job=job_id, date=date, slot__in=slot_list
                    )

                    if job_work_hours_qs.exists():
                        ids = list(job_work_hours_qs.values_list("id", flat=True))
                        deleted_ids.extend(ids)

                        self.__notify_user(job_id, date, len(ids), request.user.pk)
                        job_work_hours_qs.delete()
                    else:
                        failed_items.append({"item": item, "error": "No matching hours found"})
                except Exception as e:
                    failed_items.append({"item": item, "error": str(e)})

            response = {
                "Status": {
                    "Code": "Partial Success" if failed_items else "Success"
                },
                "Deleted": deleted_ids,
                "Failed": failed_items
            }

            return Response(response, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                "Status": {
                    "Code": "Fail"
                },
                "Result": str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

    
    def __notify_user(self, job_id, date, hours_deleted, request_user_id):

        job = Jobs.objects.get(id=job_id)
        facility = Facility.objects.get(id=job.facility.id)
        job_requests = JobProfessionalRequest.objects.filter(job=job)

        formatted_date = date.strftime("%m-%d-%Y")
        hours_text = f"{hours_deleted} hr" if hours_deleted == 1 else f"{hours_deleted} hrs"
        user_name = f"{facility.fac_first_name} {facility.fac_last_name}"

        for request in job_requests:
            JobProfessionalRequestMessages.objects.create(
                job_request=request.id,
                message_from=facility.user.pk,
                message_to=request.professional.user.pk,
                message=f"Shift on {formatted_date} {hours_text} was deleted by {user_name}",
                status="New",
                created_by=request_user_id
            )



class JobSearch(APIView):
    serializer_class = JobSerializers
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            
            search_filters   =  {}
            start_date       =  request.data.get("start_date",None)
            end_date         =  request.data.get("end_date",None)
            discipline       =  request.data.get("discipline",[])
            speciality       =  request.data.get("speciality",[])
            work_setting     =  request.data.get("work_setting",[])
            job_type         =  request.data.get("job_type",[])
            language         =  request.data.get("language",[])
            visit_type       =  request.data.get("visit_type",[])
            experience       =  request.data.get("years_of_exp",[])
            license          =  request.data.get("license", None)
            cpr_bls          =  request.data.get("cpr_bls", None)
            zipcode          =  request.data.get("zipcode",None)
            keyword          =  request.data.get("keyword",None)

            jobs = Jobs.objects.all().order_by('-created')

            if language:
                search_filters["languages__in"] = language
            
            if job_type:
                search_filters["job_type__in"] = job_type
            
            if work_setting:
                search_filters["work_setting__in"] = work_setting
        
            if discipline:
                search_filters["discipline__in"] = discipline
        
            if speciality:
                search_filters["speciality__in"] = speciality
            
            if visit_type:
                search_filters["visit_type__in"] = visit_type
            
            if experience:
                search_filters["years_of_exp__in"] = experience
            
            if zipcode:
                search_filters["zipcode"] = zipcode
            
            if license:
                search_filters["license"] = license
            
            if cpr_bls:
                search_filters["cpr_bls"] = cpr_bls
 
            if start_date:
                search_filters["start_date"] = start_date

            if end_date:
                search_filters["end_date"] = end_date
            
            if search_filters:
                jobs = Jobs.objects.filter(**search_filters)

            #Search by keyword
            if keyword:
                jobs = jobs.filter(
                    Q(job_title__icontains=keyword)
                )
            
            serializer = self.serializer_class(jobs,many=True)
            job = serializer.data

            response = {
                "Status": {
                    "Code": "Success"
                },
                "Result": "Jobs retrived successfully",
                "data": job
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


class JobHoursViewSet(viewsets.ModelViewSet):
    queryset = JobHours.objects.all()
    serializer_class = HourSerializers
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = JobHours.objects.all()
        fac_id = self.request.query_params.get('FacID')
        job_id = self.request.query_params.get('JobID')
        if fac_id:
            queryset = queryset.filter(facility__id=fac_id)
        if job_id:
            queryset = queryset.filter(job__id=job_id)
        return queryset

    def create(self, request, *args, **kwargs):
        data_list = request.data if isinstance(request.data, list) else [request.data]
        created, updated, deleted = [], [], []

        for data in data_list:
            job_id = data.get('job')
            facility_id = data.get('facility')
            date = data.get('date')
            hours = data.get('hours')

            existing_job = JobHours.objects.filter(
                job=job_id,
                facility=facility_id,
                date=date
            ).first()

            if existing_job:
                if hours:
                    existing_job.hours = hours
                    existing_job.save()
                    updated.append(existing_job.id)
                else:
                    deleted.append(existing_job.id)
                    existing_job.delete()
            else:
                if hours:
                    serializer = self.get_serializer(data=data)
                    serializer.is_valid(raise_exception=True)
                    instance = serializer.save()
                    created.append(instance.id)

        return Response({
            "Result": "Job Hours processed successfully",
            "Created": created,
            "Updated": updated,
            "Deleted": deleted
        }, status=status.HTTP_200_OK)