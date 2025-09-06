from datetime import datetime
import pytz
import base64
from django.core.mail import send_mail
from django.conf import settings

def convertDateFormat(date,format=None):
    if format is not None:
        if format == "MM:DD:YYY":
            print("Converting starts")
            cleaned_date_str = date.split(' (')[0]
            print(cleaned_date_str)         
            date_obj = datetime.strptime(cleaned_date_str, "%a %b %d %Y %H:%M:%S GMT%z")
            print(date_obj)
            formatted_date = date_obj.strftime("%Y-%m-%d")
            print(formatted_date)
            return formatted_date
        else:
            date_obj = datetime.strptime(date, "%Y-%m-%d")
            formatted_date = date_obj.strftime("%m-%d-%Y")
            return formatted_date
    else:
        raise Exception("Error converting date format")


def convertToUSA(date):
    utc_datetime = datetime.strptime(date, '%Y-%m-%dT%H:%M:%S.%fZ')
    utc_datetime = pytz.utc.localize(utc_datetime)
    us_timezone = pytz.timezone('US/Eastern')
    us_time = utc_datetime.astimezone(us_timezone)
    new_date = str(us_time).split(" ")[0]
    return new_date


def encode_data(data):
    sample_string_bytes = data.encode("ascii")
    base64_bytes = base64.b64encode(sample_string_bytes)
    base64_string = base64_bytes.decode("ascii")
    return base64_string

def ref_mail(subject, message, email):
    try:
        mail = send_mail(subject,"User verification",settings.DEFAULT_FROM_EMAIL,[email],fail_silently=False,html_message=message)
        return True
    except Exception as e:
        print("Error sending mail",str(e))
        raise Exception("Error sending mail......")

