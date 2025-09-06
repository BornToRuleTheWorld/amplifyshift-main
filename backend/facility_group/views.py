from django.shortcuts import render
from .models import FacilityGroup
from .serializers import FacilityLinkSerializers, FacilityGroupSerializers
from rest_framework.generics import CreateAPIView,ListAPIView,UpdateAPIView,DestroyAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response
from rest_framework import status

# Create your views here.

class CreateFacilityGroup(CreateAPIView):
    serializer_class = FacilityGroupSerializers
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            data = request.data
            serializer = self.serializer_class(data=data, many=isinstance(data, list))
            serializer.is_valid(raise_exception=True)
            facility_group = serializer.save()

            response = {
                "Status": {
                    "Code": "Success"
                },
                "Result": "Facility Group created successfully",
                "ID":facility_group.id,
                "Email": facility_group.fac_grp_email
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
        

class GetFacilityGroup(ListAPIView):

    serializer_class = FacilityGroupSerializers
    permission_classes  = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def get(self, request, *args, **kwags):
        try:
            fac_email = request.GET.get('FacGrpEmail')
            fac_user = request.GET.get('FacGrpUser')

            try:
                user_id = int(fac_user)
            except:
                raise Exception("UserID must be and integer")

            try:
                fac = FacilityGroup.objects.get(fac_grp_email=fac_email,user=user_id)
            except FacilityGroup.DoesNotExist:
                raise Exception("Data not Found")

            serializer = self.serializer_class(fac)
            facility_group = serializer.data
            facility_group['id'] = fac.id

            response = {
                "Status":{
                    "Code":"Success"
                },
                "Result" : "Facility Group Retrived successfully",
                "data"   : facility_group
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
        

class UpdateFacilityGroup(UpdateAPIView):
    serializer_class = FacilityGroupSerializers
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def put(self, request, email, *args, **kwargs):
        try:
            try:
                facility = FacilityGroup.objects.get(fac_grp_email= email)
            except FacilityGroup.DoesNotExist:
                raise Exception("Data not found")

            serializer = self.get_serializer(facility, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            facility_data = serializer.save()
           
            response = {
                "Status": {
                    "Code": "Success"
                },
                "Result": "Facility updated successfully",
                "id": facility_data.id
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


class CreateFacilityGrpLink(CreateAPIView):
    serializer_class = FacilityLinkSerializers
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            data = request.data
            serializer = self.serializer_class(data=data, many=isinstance(data, list))
            serializer.is_valid(raise_exception=True)
            facility_link = serializer.save()

            response = {
                "Status": {
                    "Code": "Success"
                },
                "Result": "Facility group link created successfully",
                "ID":facility_link.id
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