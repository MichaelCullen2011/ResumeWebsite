# Generated by Django 3.1.1 on 2020-09-12 19:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('product', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='summary',
            field=models.TextField(default='Hello'),
        ),
    ]
