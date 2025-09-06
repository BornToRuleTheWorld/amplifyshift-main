from django.shortcuts import render
from rest_framework.generics import CreateAPIView,ListAPIView,UpdateAPIView, DestroyAPIView
from .serializers import *
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from .models import *

# Create your views here.
class CreateMembership(CreateAPIView):
    serializer_class = MemberShipSerializers
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            print(request.data)
            serializer = self.get_serializer(data=request.data, many=isinstance(request.data, list))
            serializer.is_valid(raise_exception=True)
            membership = serializer.save()
            print("membership",membership)
            if membership.is_popular:
                membership_data = MembershipPlan.objects.filter(user_type=membership.user_type)
                membership_data.exclude(id = membership.id).update(is_popular=False)


            response = {
                "Status": {
                    "Code": "Success"
                },
                "Result"      : "Membership created successfully",
                "MembershipID"  :  membership.id
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


class CreateFeature(CreateAPIView):
    serializer_class = FeatureSerializers
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            print(request.data)
            serializer = self.get_serializer(data=request.data, many=isinstance(request.data, list))
            serializer.is_valid(raise_exception=True)
            feature = serializer.save()

            response = {
                "Status": {
                    "Code": "Success"
                },
                "Result" : "Membership features created successfully",
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

class DeleteFeature(DestroyAPIView):
    serializer_class = FeatureSerializers
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def destroy(self, request, id, *args, **kwargs):
        try:
            if id is not None:
                try:
                    id = int(id)
                except ValueError:
                    raise Exception("Invalid feature id")
            else:
                raise Exception("Feature id must not be empty")

            faeture = PlanFeatures.objects.filter(id=id)
            if faeture.count() > 0:
                self.perform_destroy(faeture.first())
            else:
                raise Exception("Data not found")
            
            response = {
                "Status": {
                    "Code": "Success"
                },
                "Result": "Feature deleted successfully",
                "id": id
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

class GetMembership(APIView):
    serializer_class       = MemberShipSerializers
    permission_classes     = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def get(self, request, *args, **kwargs):
        try:
            membership_id   = request.GET.get("MembershipID",None)

            if not membership_id:
                raise Exception("MembershipID must not be empty")
            elif isinstance(membership_id,int):
                raise Exception("Invalid MembershipID")
                
            membership = MembershipPlan.objects.filter(id = membership_id)
            print("membership",membership)
            if membership.exists():
                membership = membership.first()
                membership_data = self.serializer_class(membership).data
                features = PlanFeatures.objects.filter(membership=membership_data['id']).order_by("sort_order")
                feature_data = FeatureSerializers(features,many=True).data
                membership_data['features'] = feature_data
            else:
                raise Exception("Invalid MembershipID, Data not found")
            print("membership_data",membership_data)
            response = {
                "Status": {
                    "Code": "Success"
                },
                "Result": "Memberships retrived successfully",
                "data"  : membership_data
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
        

class GetAllMemberships(APIView):
    serializer_class       = MemberShipSerializers
    permission_classes     = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def post(self, request, *args, **kwargs):
        try:
            search_filters   = {}
            membership_data  = []
            current_page     =  request.data.get("CurrentPage",None)
            records_per_page =  request.data.get("RecordsPerPage",None)
            user_type        =  request.data.get("UserType",None)

            membership = MembershipPlan.objects.all().order_by('-created')

            if user_type:
                membership = membership.filter(user_type=user_type)

            total_records = membership.count()
            if current_page and records_per_page:

                if not isinstance(current_page, int):
                    raise Exception('Current page is invalid')

                if not isinstance(records_per_page, int):
                    raise Exception('Records per page is invalid')
                
                indexOfFirstItem = (current_page - 1) * records_per_page
                indexOfLastItem =  indexOfFirstItem + records_per_page
                membership       = membership[indexOfFirstItem:indexOfLastItem]
            
            membership_data = self.serializer_class(membership,many=True).data
            for plan in membership_data:
                features = PlanFeatures.objects.filter(membership=plan['id']).order_by("sort_order")
                feature_data = FeatureSerializers(features,many=True).data
                plan['features'] = feature_data
            
            response = {
                "Status": {
                    "Code": "Success"
                },
                "Result": "Memberships retrived successfully",
                "data":membership_data,
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


class UpdateMembership(UpdateAPIView):
    serializer_class       = MemberShipSerializers
    permission_classes     = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def put(self, request, id, *args, **kwargs):
        # try:
            print(request.data)
            membership_id   = id
            features_data   = request.data.pop('features')  
            
            if not membership_id:
                raise Exception("MembershipID must not be empty")
            else:
                try:
                    int(membership_id)
                except:
                    raise Exception("Invalid MembershipID")

            membership = MembershipPlan.objects.filter(id = membership_id)
            if membership.exists():
                membership = membership.first()
                serializer = self.get_serializer(membership, data=request.data, partial=True)
                serializer.is_valid(raise_exception=True)
                membership_data = serializer.save()
                print("Update membership data", membership_data)
                print("Update membership data type", type(membership_data))
                if membership_data.is_popular:
                    membership = MembershipPlan.objects.filter(user_type=membership_data.user_type)
                    membership.exclude(id = membership_data.id).update(is_popular=False)
                
                if features_data:
                    for feature in features_data:
                        feature_id = feature.get('id')

                        if feature_id:
                            existing_feature = PlanFeatures.objects.filter(id=feature_id, membership=membership_data.id).first()
                            if existing_feature:
                                feature_serializer = FeatureSerializers(existing_feature, data=feature, partial=True)
                                feature_serializer.is_valid(raise_exception=True)
                                feature_serializer.save()
                        else:
                            feature_serializer = FeatureSerializers(data=feature)
                            feature_serializer.is_valid(raise_exception=True)
                            feature_serializer.save()
            else:
                raise Exception("Invalid MembershipID, Data not found")
            
            response = {
                "Status": {
                    "Code": "Success"
                },
                "Result"      : "Memberships updated successfully",
                "MembershipID":  membership_data.id,
            }
            return Response(response, status=status.HTTP_200_OK)

        # except Exception as e:
        #     error_response = {
        #         "Status": {
        #             "Code": "Fail"
        #         },
        #         "Result": str(e)
        #     }
        #     return Response(error_response, status=status.HTTP_400_BAD_REQUEST)
            