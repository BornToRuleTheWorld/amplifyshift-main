from django.shortcuts import render
from django.contrib.auth.models import User,Group
from rest_framework.generics import CreateAPIView,ListAPIView,UpdateAPIView
from rest_framework import status, viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.core.mail import send_mail,get_connection
from django.conf import settings
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode  
from django.template.loader import render_to_string
from .tokens import account_activation_token
from .utils import send_email
from django.contrib.auth.tokens import default_token_generator
from django.urls import reverse
from django.utils.encoding import force_str
from rest_framework.views import APIView
from django.utils import timezone
from .serializers import *
from .models import *
from professional.models import Professional
from facility.models import Facility

# Create your views here.

class CreateVerifyUser(CreateAPIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def post(self, request, *args, **kwargs):
        try:

            response = {"Status": {"Code": "Success"},}
            method =  request.data.pop('method')

            if method == "" and method not in ['Create','authenticate']:
                raise Exception("Invalid method is defined or empty")

            if method == "Create":
                password = request.data.pop('password')
                user_count = User.objects.filter(email = request.data['email']).count()
                if user_count == 0:
                    group_name = request.data.pop('group_name')
                    group = Group.objects.get(name=group_name)
                    user = User.objects.create(**request.data)
                    user.set_password(password)
                    user.groups.add(group)
                    response['Status']['ExtraInfo'] = "User created successfully"
                    response['UserID'] = user.pk
                    response['Email'] = user.email
                else:
                    raise Exception("Email already exists")
            else:
                user = User.objects.filter(email=request.data['email'],password=request.data['password'] )
                if user.count() == 0:
                    raise Exception("Invalid email or password")
                else:
                    group = user.first().groups.all().first()
                    response['Status']['ExtraInfo'] = "User authenticated successfully"
                    response['UserID'] = user.first().pk
                    response['Email'] = user.first().email
                    response['Group'] = group.name
            
            send_mail('User Account Registration','Account creation is successful',settings.DEFAULT_FROM_EMAIL,[user.email],fail_silently=False)
            
            return Response(response, status=status.HTTP_200_OK)

        except Exception as e:
            error_response = {
                "Status": {
                    "Code": "Fail"
                },
                "Result": str(e)
            }
            return Response(error_response, status=status.HTTP_400_BAD_REQUEST)
        

class GenerateUserOrLink(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def post(self, request, *args, **kwargs):
        try:
            if request.data is not None:
                method = request.data.pop("method")
                if method and method in ['create','regenerate']:
                    if method =="create":
                        if request.data['email'] in [None or '' or ""]:
                            raise Exception("Invalid data")
                        
                        user_count = User.objects.filter(email = request.data['email']).count()
                        if user_count == 0:
                            group_name = request.data.pop('group_name')
                            password = request.data.pop("password")
                            group = Group.objects.get(name=group_name)
                            user = User.objects.create(**request.data)
                            user.groups.add(group)
                            user.is_active = False
                            user.set_password(password)
                            user.save()
                            if not user:
                                raise Exception("Failed to Create User")
                        else:
                            raise Exception("Email already exists")
                    else:
                        link = request.data.get('Link',None)
                        email = force_bytes(urlsafe_base64_decode(link)).decode()
                        user = User.objects.get(email=email)
                    
                    #email sender    
                    token = account_activation_token.make_token(user)
                    user_uuid = urlsafe_base64_encode(force_bytes(user.pk))
                    send_email(user_uuid,token,user.email)
                
                else:
                    raise Exception("Invalid or empty method")
            else:
                raise Exception("Request data must not be empty")
            
            response = {
                "Status": "Success",
                "Result": {
                    "UserID": user.pk,
                    "Email": user.email
                }
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
        

class VerifyLogin(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def post(self,request,*args,**kwagrs):
        try:
            error    = {}
            email    = request.data['email']
            password = request.data["password"]
            response = {"Status": "Success"}

            user = User.objects.filter(email=email)
            if user.exists():
                validated = user.first().check_password(password)
                if not validated:
                    error["Password"] = "Invalid Password"
                elif user.first().is_active == False:
                    user_uuid_email = urlsafe_base64_encode(force_bytes(user.first().email)) 
                    error["ActivationLink"] = user_uuid_email
                else:
                    user = user.first()
                    user_group = user.groups.first().name
                    
                    group_user = None
                    if user_group:
                        if user_group == "Professional":
                            group_user = user.professional_set.all()
                        elif user_group == "Facility":
                            group_user = user.facility_set.all()
                  
                    response["Result"] = {
                        "UserID": user.pk,
                        "Email": user.email,
                        "Group": user_group,
                        "GroupUserID" : group_user[0].id if group_user else None
                    }
            else:
                error["Email"] = "Invalid email, user not found"

            if len(error)>0:
                raise Exception(error)

            return Response(response,status=status.HTTP_200_OK)

        except Exception as e:
            error_response={
                "Status": "Error",
                "Error": eval(str(e))
            }
            return Response(error_response, status=status.HTTP_400_BAD_REQUEST)
        

class VerifyUser(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            if request.data is not None:
                uuid = request.data.get('uuid',None)
                token = request.data.get('code',None)
                if uuid and token:
                    try:  
                        user_id = force_bytes(urlsafe_base64_decode(uuid))  
                        user = User.objects.get(pk=user_id)  
                    except(TypeError, ValueError, OverflowError, User.DoesNotExist):
                        user = None
                        raise Exception("Activation Failed")
                    if user is not None and account_activation_token.check_token(user, token):  
                        user.is_active = True
                        user.last_login = timezone.now()
                        group_name = user.groups.first().name
                        if group_name == "Professional":
                            prof_data = Professional.objects.get(user=user)
                            prof_data.prof_status = Professional.ProfStatus.APPROVAL
                            prof_data.save()
                        else:
                            if group_name == "Facility":
                                fac_data = Facility.objects.get(user=user)
                                fac_data.fac_activated_on=timezone.now()
                                fac_data.fac_status = Facility.FacStatus.ACTIVE
                                fac_data.save()    

                        user.save()
                    else:
                        raise Exception("Invalid actiavtion code")
            else:
                raise Exception('Invalid Request')


            response = {
                "Status":"Success",
                "Activation":"User Activated Successfully",
                "Result":{
                    "UserID":user.pk,
                    "Email":user.email,
                    "Group":user.groups.first().name
                }
            }

            return Response(response,status=status.HTTP_200_OK)

        except Exception as e:
            error_response = {
                "Status":"Fail",
                "Activation":"User Activated Failed",
                "Result":str(e)
            }
            return Response(error_response,status=status.HTTP_400_BAD_REQUEST)

class ForgotPasswordView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        if not email:
            return Response({"Status": "Error", "Error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
            if not user.is_active:
                return Response({"Status": "Error", "Error": "Inactive user"}, status=status.HTTP_400_BAD_REQUEST)

            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)
            reset_link = f"{settings.FRONTEND_URL}/password-reset-confirm/{uid}/{token}"

            mail_response = send_mail(
                subject="Password Reset Request",
                message=f"Click the link below to reset your password:\n\n{reset_link}",
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
            )

            print(f"Forgot password mail response", mail_response)

            return Response({"Status": "Success", "Message": "Password reset link sent to your email."}, status=status.HTTP_200_OK)

        except User.DoesNotExist:
            return Response({"Status": "Error", "Error": "User with this email does not exist."}, status=status.HTTP_404_NOT_FOUND)
        
class ResetPasswordConfirmView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, uidb64, token, *args, **kwargs):
        password = request.data.get('password')
        if not password:
            return Response({"Status": "Error", "Error": "Password is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)

            if not default_token_generator.check_token(user, token):
                return Response({"Status": "Error", "Error": "Invalid or expired token"}, status=status.HTTP_400_BAD_REQUEST)

            user.set_password(password)
            user.save()

            return Response({"Status": "Success", "Message": "Password has been reset successfully."}, status=status.HTTP_200_OK)

        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({"Status": "Error", "Error": "Invalid reset request"}, status=status.HTTP_400_BAD_REQUEST)


class CreateSlot(CreateAPIView):
    serializer_class = SlotSerializers
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def post(self, request, *args, **kwargs):
        try:
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


class GetSlot(APIView):
    serializer_class = SlotSerializers
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def post(self, request, *args, **kwargs):
        try:
            slot_ids = request.data.get('slot_ids', None)
            print("slot_ids",slot_ids)
            slot = Slots.objects.filter(id__in = slot_ids)
            if slot.count() == 0:
                raise Exception("Slot not Found")
            else:
                serializer = self.serializer_class(slot,many=True)
                slot_data = serializer.data
                response = {
                    "Status":{
                        "Code":"Success"
                    },
                    "Result" : "Slot Retrived successfully",
                    "data"   : slot_data
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


class GetSlots(ListAPIView):
    serializer_class = SlotSerializers
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def get(self, request, *args, **kwargs):
        try:
            try:
                slots = Slots.objects.all()
            except Slots.DoesNotExist:
                raise Exception("Slots not Found")
            
            serializer = self.serializer_class(slots, many=True)
            slot_data = serializer.data

            response = {
                "Status":{
                    "Code":"Success"
                },
                "Result" : "Slots Retrived successfully",
                "data"   : slot_data
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



class UpdateSlot(UpdateAPIView):
    serializer_class = SlotSerializers
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
                slot = Slots.objects.get(id=id)
            except Slots.DoesNotExist:
                raise Exception("Slot not found")

            serializer = self.get_serializer(slot, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            slot_data = serializer.save()
           
            response = {
                "Status": {
                    "Code": "Success"
                },
                "Result": "Slot updated successfully",
                "Slot": slot_data.id
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

class ChangePassword(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:

            user_id = request.data.get('user_id',None)    
            old_password = request.data.get('old_password',None)
            new_password = request.data.get('new_password',None)
            confirm_password = request.data.get('confirm_password',None)

            if new_password != confirm_password:
                raise Exception("Password does not match")

            user = User.objects.filter(id=user_id)
            if user.exists():
                user = user.first()
                if user.check_password(old_password):
                    if old_password == new_password:
                        raise Exception("New password is same as old password")
                    else:
                        new_password = new_password
                        user.set_password(new_password)
                        user.save()
                else:
                    raise Exception("Invalid old password")
            else:
                raise Exception("Password update failed")
        
            response = {
                "Status": {
                    "Code": "Success"
                },
                "Result": "Password changed successfully",
                "userID" : user_id
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

class GetModules(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            modules = request.data.get("Modules", [])
            module_data = {}
            for module in modules:
                if module == "QA":
                    data = UserVerificationQA.objects.all()
                    serializer = VerificationQASerializers
                elif module == "Speciality":
                    data = Speciality.objects.all()
                    serializer = SpecialitySerializers
                elif module == "Language":
                    data = Languages.objects.all()
                    serializer = LanguageSerializers
                elif module == "Discipline":
                    data = Discipline.objects.all()
                    serializer = DisciplineSerializers
                elif module == "WorkExp":
                    data = WorkSettingExp.objects.all()
                    serializer = WorkSettingExpSerializers
                elif module == "DocSoftware":
                    data = DocSoftware.objects.all()
                    serializer = DocSoftSerializers
                elif module == "WorkSetting":
                    data = WorkSetting.objects.all()
                    serializer = WorkSettingSerializers
                elif module == "JobType":
                    data = JobType.objects.all()
                    serializer = JobTypeSerializers
                elif module == "VisitType":
                    data = VisitType.objects.all()
                    serializer = VisitTypeSerializers
                elif module == "State":
                    data = State.objects.all()
                    serializer = StateSerializers
                elif module == "Country":
                    data = Country.objects.all()
                    serializer = CountrySerializers
                elif module == "Skills":
                    data = ComputerSkills.objects.all()
                    serializer = ComSkillsSerializers
                else:
                    continue

                if serializer:
                    serialized_data = serializer(data, many=True)
                    module_data[module] = serialized_data.data

            response = {
                "Status": {
                    "Code": "Success"
                },
                "Result": "Modules retrieved successfully",
                "data": module_data
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

class ValidateEmail(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            user_email = request.data.get('Email',None)

            if not user_email:
                raise Exception("Invalid email must not be empty")

            user = User.objects.filter(email=user_email)
            if user.exists():
               raise Exception('Email already exists')
        
            response = {
                "Status": {
                    "Code": "Success"
                },
                "Result": "Email verified successfully",
                "Email" :  user_email
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


class DocSoftViewSet(viewsets.ModelViewSet):
    queryset = DocSoftware.objects.all()
    serializer_class = DocSoftSerializers
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        doc_soft_name = request.data.get('doc_soft_name')
        category_id = request.data.get('category')
        existing_entry = DocSoftware.objects.filter(doc_soft_name=doc_soft_name, category_id=category_id).first()
        if existing_entry:
            serializer = self.get_serializer(existing_entry)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return super().create(request, *args, **kwargs)


class LanguageViewSet(viewsets.ModelViewSet):
    queryset = Languages.objects.all()
    serializer_class = LanguageSerializers
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        lang_name = request.data.get('lang_name')
        category_id = request.data.get('category')
        existing_entry = Languages.objects.filter(lang_name=lang_name, category_id=category_id).first()
        if existing_entry:
            serializer = self.get_serializer(existing_entry)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return super().create(request, *args, **kwargs)
        

import logging
logger = logging.getLogger("mail")

def test_mail(request):
    starting_process = "---Starting the mail process---"
    end_process = "---Mail Process Has Ended---"
    subject = "Test mail For AmplifyShift"
    mail_context = "TEST MAIL PROCESS"
        
    smtp_server = settings.EMAIL_HOST
    smtp_port = settings.EMAIL_PORT
    
    try:
        send_mail(subject, 
                  mail_context, 
                  settings.EMAIL_HOST_USER,
                  ["karthiksrinivasamoorthy@gmail.com", "ameenminhaz@emicosolutions.com"],
                  auth_user="karthik.MASK.31@gmail.com",
                  auth_password="xzca kwjt ndze lobx"
                )
        response_content = "---Mail Sent---"
    except Exception as e:
        logger.error(f"Error sending email: {e}")
        response_content = f"Error sending email: {e}"

    data = {
        'starting_process': starting_process,
        'end_process': end_process,
        'subject': subject,
        'mail_context': mail_context,
        'response': response_content,
        'smtp_server': smtp_server,
        'smtp_port': smtp_port,
    }

    return render(request, 'email_verification/test_mail.html', data)



        


        

