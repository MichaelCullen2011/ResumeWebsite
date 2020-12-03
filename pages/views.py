from django.shortcuts import render
from django.template.loader import get_template
from django.core.mail import EmailMessage
from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from mysite.forms import ContactForm
from django.shortcuts import render, redirect
from django.core.mail import send_mail, BadHeaderError
from django.conf import settings
from django.core.mail import send_mail

# Create your views here.


def homepage_view(request, *args, **kwargs):
    return render(request, "homepage.html", {})


def contact_view(request):
    if request.method == 'GET':
        form = ContactForm()
    else:
        form = ContactForm(request.POST)
        if form.is_valid():
            name = form.cleaned_data['name']
            email = form.cleaned_data['email']
            message = form.cleaned_data['message']
            try:
                send_mail(name + " sent an email from " + email, message, settings.DEFAULT_FROM_EMAIL, [settings.EMAIL_HOST_USER])
            except:
                return HttpResponse('Invalid Header Found')
            return redirect('success')
        else:
            return HttpResponse('Make sure all fields are valid')
    return render(request, "contact.html", {'form': form})


def success_view(request):
    return render(request, "contact_sent.html", {'form': ContactForm()})


def cv_view(request, *args, **kwargs):
    my_context = {
        "this_is_true": True,
        "my_text": "About me",
        "my_number": 123,
        "my_list": ["a", "b", "c", "d", "e"]
    }
    return render(request, "cv.html", my_context)
