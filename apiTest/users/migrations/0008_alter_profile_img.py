# Generated by Django 4.0.3 on 2022-06-06 16:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0007_remove_projectmember_project_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='img',
            field=models.ImageField(upload_to=''),
        ),
    ]