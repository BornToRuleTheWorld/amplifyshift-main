from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import status, authentication, permissions, response, viewsets
from .serializers import *
from .models import *
from contract.models import *
from professional.models import Professional
from professional.serializers import ProfessionalSerializers
from facility.models import Facility
from facility.serializers import FacilitySerializers
from contract.models import Contract
from contract.serializers import ContractSerializers
from rest_framework.decorators import action

# Create your views here.
class InvoiceViewSet(viewsets.ModelViewSet):
    queryset               = Invoices.objects.all()
    serializer_class       = InvoiceSerializers
    permission_classes     = [permissions.IsAuthenticated]
    authentication_classes = [authentication.TokenAuthentication]

    def get_queryset(self):
        queryset = Invoices.objects.all()
        fac_id = self.request.query_params.get('FacUserID', None)
        if fac_id is not None:
            queryset = queryset.filter(created_by = fac_id)
        return queryset

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

    def __validate_int(self, id, name):
        try:
            int(id)
        except:
            raise Exception(f"Invalid {name} id, must be an integer")


    def create(self, request, *args, **kwargs):
        try:
            data = request.data

            print("Data", data)
            # Create Invoices
            invoice_data = self.__create_invoices(data)
           
           # Create Hrs
            self.__create_invoice_hrs(invoice_data, invoice_data.contract, invoice_data.professional, invoice_data.start_date, invoice_data.end_date)

            # Serialize the result
            serializer = self.get_serializer(invoice_data)

            success_response = {
                "Status": {
                    "Code": "Success"
                },
                "Result": "Invoice(s) created successfully",
                "Data": serializer.data
            }
            return response.Response(success_response, status=status.HTTP_201_CREATED)

        except Exception as e:
            error_response = {
                "Status": {
                    "Code": "Fail"
                },
                "Result": str(e)
            }
            return response.Response(error_response, status=status.HTTP_400_BAD_REQUEST)

    def __create_invoices(self, data):
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        invoices = serializer.save()
        return invoices

    def __create_invoice_hrs(self, invoice, contract_id, prof_id, start_date, end_date):
        con_hours = ContractHours.objects.filter(contract = contract_id, contract__job_request__professional = prof_id, job_work_hours__date__range = [start_date, end_date], status="Completed")
        for hours in con_hours:
            hours.status = ContractHours.HourStatus.INVOICED
            hours.save()
            InvoiceHours.objects.create(
                invoice = invoice,
                contract_hours = hours
            )
    

    def list(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            serializer = self.get_serializer(queryset, many=True)
            invoice_data = serializer.data

            for data in invoice_data:
                data["professional"] = self.__get_professional(data['professional'])
                data["facility"] = self.__get_facility(data['facility'])
                data["contract"] = self.__get_contract(data['contract'])
            
            success_response = {
                "Status": {
                    "Code": "Success"
                },
                "Result": "Invoice(s) retrieved successfully",
                "data": invoice_data
            }
            return response.Response(success_response, status=status.HTTP_201_CREATED)

        except Exception as e:
            error_response = {
                "Status": {
                    "Code": "Fail"
                },
                "Result": str(e)
            }
            return response.Response(error_response, status=status.HTTP_400_BAD_REQUEST)
    

    @action(detail=False, methods=['post'], url_path='invoice-list')
    def invoice_list(self, request, *args, **kwargs):
        try:
            
            filters    = {}
            fac_id     = request.data.get('facUserID', None)
            con_id     =  request.data.get('conID', None)
            prof_id    =  request.data.get('profID', None)
            start_date = request.data.get('startDate', None)
            end_date   = request.data.get('endDate', None)

            if fac_id:
                self.__validate_int(fac_id, 'facility')
                filters['created_by'] = fac_id
            else:
                raise Exception("Facility id must not be empty")
            
            if con_id:
                self.__validate_int(con_id, 'contract')
                filters['contract__id'] = con_id
            
            if prof_id:
                self.__validate_int(prof_id, 'professional')
                filters['professional__id'] = prof_id
            
            if start_date and end_date:
                filters['invoice_date__range'] = [start_date, end_date]


            queryset = self.get_queryset().filter(**filters)
            serializer = self.get_serializer(queryset, many=True)
            invoice_data = serializer.data

            for data in invoice_data:
                data["professional"] = self.__get_professional(data['professional'])
                data["facility"] = self.__get_facility(data['facility'])
                data["contract"] = self.__get_contract(data['contract'])
            
            prof_options, con_options = self.__get_invoice_contract_professional(fac_id)
            
            success_response = {
                "Status": {
                    "Code": "Success"
                },
                "Result": "Invoice(s) retrieved successfully",
                "data": invoice_data,
                "con_options": con_options,
                "prof_options":prof_options
            }
            return response.Response(success_response, status=status.HTTP_201_CREATED)

        except Exception as e:
            error_response = {
                "Status": {
                    "Code": "Fail"
                },
                "Result": str(e)
            }
            return response.Response(error_response, status=status.HTTP_400_BAD_REQUEST)

    def __get_invoice_contract_professional(self, fac_id):

        invoice_prof     = []
        invoice_contract = []

        invoices = Invoices.objects.filter(created_by = fac_id)
        if invoices.exists():
            for invoice in invoices:
                prof_data = {
                    "value": invoice.professional.id,
                    "label": f"{invoice.professional.prof_first_name} {invoice.professional.prof_last_name}"
                }

                con_data = {
                    "value" : invoice.contract.id,
                    "label" : invoice.contract.contract_no
                }

                invoice_prof.append(prof_data)
                invoice_contract.append(con_data)
        
        return invoice_prof, invoice_contract