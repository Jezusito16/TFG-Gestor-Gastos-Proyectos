from django.conf import settings
from django.core.mail import send_mail
from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(['POST'])
def send_email(request):
    try:
        send_mail(
            'From: ' + request.data['email'],
            request.data['message'],
            settings.DEFAULT_FROM_EMAIL,
            [request.data['toemail']],
            fail_silently=False,
        )
        return Response({"succed": "Email Sended"})
    except:
        return Response({"message": "Error sending email"})
    