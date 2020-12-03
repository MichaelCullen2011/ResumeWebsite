from django.db import models


class Contact(models.Model):
    full_name = models.CharField(max_length=100)
    email_address = models.CharField(max_length=100)
    message = models.CharField(max_length=400)

    def __str__(self):
        return f"{self.full_name}"
