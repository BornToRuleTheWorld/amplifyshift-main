from django.shortcuts import render
from rest_framework.generics import CreateAPIView,ListAPIView,UpdateAPIView,DestroyAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response
from rest_framework import status
from .serializers import MessageSerailaizers
from .models import JobProfessionalRequestMessages
from professional.models import Professional
from facility.models import Facility
from django.contrib.auth.models import User

# Create your views here.
class CreateMessage(CreateAPIView):
    serializer_class = MessageSerailaizers
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        print("CreateMessage",request.data)
        try:
            role = request.data.pop('role')
            if role == "facility":
                prof = Professional.objects.get(id=request.data['message_to'])
                request.data['message_to'] = prof.user.pk
            else:
                fac = Facility.objects.get(id=request.data['message_to'])
                request.data['message_to'] = fac.user.pk
           
            serializer = self.get_serializer(data=request.data, many=isinstance(request.data, list))
            serializer.is_valid(raise_exception=True)
            message = serializer.save()

            response = {
                 "Status" : {
                    "Code": "Success"
                },
                "Result"  : "Message created successfully",
                "Message" : message.id 
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


class GetMessage(ListAPIView):
    serializer_class = MessageSerailaizers
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        try:
            message_fields = {}
            fac_id  = request.GET.get('FacID', None)
            prof_id = request.GET.get('ProfID', None)
            role    = request.GET.get('role',None)

            if fac_id is not None:
                try:
                    fac_id = int(fac_id)
                except:
                    raise Exception("Invalid FacID")
            
            if prof_id is not None:
                try:
                    prof_id = int(prof_id)
                except:
                    raise Exception("Invalid ProfID")
                
            if role is not None:
                if role == "facility":
                    prof = Professional.objects.get(id=prof_id)
                    prof_id = prof.user.pk
                    user_name = f"{prof.prof_first_name} {prof.prof_last_name}"
                    message_fields['message_from'] = prof_id
                    message_fields['message_to'] = fac_id
                else:
                    fac = Facility.objects.get(id=fac_id)
                    fac_id = fac.user.pk
                    user_name = f"{fac.fac_first_name} {fac.fac_last_name}"
                    message_fields['message_from'] = fac_id
                    message_fields['message_to'] = prof_id
            else:
                raise Exception("Invalid role")

            try:
                request_message = JobProfessionalRequestMessages.objects.filter(**message_fields)
            except:
                raise Exception("Message not found")

            serializer = self.serializer_class(request_message, many=True)
            messages   = serializer.data
            for message in messages:
                message['username'] = user_name

            response = {
                "Status" : {
                  "Code" : "Success"
                },
                "Result" : "Message retrived successfully",
                "data"   : messages
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
        

class GetUpdateMessage(ListAPIView):
    serializer_class = MessageSerailaizers
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        try:
            response      = {"Status" : {"Code" : "Success"}}
            message_from  = request.GET.get("FromID",None)
            message_to    = request.GET.get("ToID",None)
            request_id    = request.GET.get("RequestID",None)
            role          = request.GET.get("Role",None)
            action        = request.GET.get("Action",None)
            message_id    = request.GET.get("MessageID",None)

            if request_id is not None:
                try:
                    int(request_id)
                except:
                    raise Exception("Invalid RequestID")
            
            if message_from is not None:
                try:
                    int(message_from)
                except:
                    raise Exception("Invalid FromID")

            if message_to is not None:
                try:
                    int(message_to)
                except:
                    raise Exception("Invalid ToID")
            
            if action == "Update":
                job_msg_request = JobProfessionalRequestMessages.objects.filter(id=message_id)
                if job_msg_request.count() > 0:
                    message_data = job_msg_request.first()
                    message_data.status = JobProfessionalRequestMessages.MessageStatus.OPEN
                    message_data.save()
                    response['Result'] = "Messages updated successfully"
                    response['data'] = message_data.id
                else:
                    raise Exception("Message not found")
            else:
                data = []
                if action == "All":
                    message_data = JobProfessionalRequestMessages.objects.filter(message_to=message_to, status="New")
                    if message_data.count() > 0:
                        serializer = self.serializer_class(message_data, many=True)
                        data = serializer.data
                        for message in data:
                            user = User.objects.get(id=message['message_to'])
                            message ['username'] = f"{user.first_name} {user.last_name}"
                            UserGroup = user.groups.first().name
                            if UserGroup == "Professional":
                                prof_data = Professional.objects.get(user=user)
                                message['message_to_id'] = prof_data.user.pk
                            else:
                                fac_data = Facility.objects.get(user=user)
                                message['message_to_id'] = fac_data.user.pk
                           
                    response['Count'] = message_data.count()
                        
                else:    
                    # if message_from is not None:
                    #     if role == "facility":
                    #         prof_data = Professional.objects.get(id=message_from)
                    #         message_from_id = prof_data.user.pk
                    #     else:
                    #         fac_data = Facility.objects.get(id=message_from)
                    #         message_from_id = fac_data.user.pk
                    # else:
                    #     raise Exception("Invalid Message from id")

                    message_data = JobProfessionalRequestMessages.objects.filter(job_request=request_id,status="Open")
                    if message_data.count() > 0:
                        data = message_data.values_list('id', flat=True)
                
                response['Result'] = "Messages retrived successfully"
                response['data'] = data

            return Response(response, status=status.HTTP_200_OK)
        
        except Exception as e:
            error_response = {
                "Status": {"Code": "Fail"},
                "Result": str(e)
            }
            return Response(error_response, status=status.HTTP_400_BAD_REQUEST)


class GetMessages(ListAPIView):
    serializer_class = MessageSerailaizers
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        try:
            request_id  = request.GET.get('RequestID', None)

            try:
                request_message = JobProfessionalRequestMessages.objects.filter(job_request = request_id)
            except:
                raise Exception("Message not found")

            serializer = self.serializer_class(request_message, many=True)
            messages   = serializer.data
            for message in messages:
                created_by = User.objects.get(id=message["created_by"])
                message['username'] = f"{created_by.first_name} {created_by.last_name}"

            response = {
                "Status" : {
                  "Code" : "Success"
                },
                "Result" : "Message retrived successfully",
                "data"   : messages
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