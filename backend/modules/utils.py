from django.core.mail import send_mail
from django.conf import settings

def send_email(uuid,token,email):
    try:
        message = f"Please activate your account using this link {settings.FRONTEND_URL}/activate/?code={uuid}+{token}"
        send_mail(
            'Activate Account',
            message,
            settings.DEFAULT_FROM_EMAIL,
            [email],
            fail_silently=False
        )
    except Exception as e:
        print("Error sending email",str(e))
        raise Exception("Error sending email")