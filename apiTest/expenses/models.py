from django.contrib.auth.models import User
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from projects.models import Project


class Expense (models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    dossier = models.FileField(upload_to='documents')
    date = models.DateField()
    concept = models.CharField(max_length=100)
    amount = models.FloatField()
    vatpercentage = models.FloatField(
        validators=[MinValueValidator(0.0), 
        MaxValueValidator(100.0)])
    final_amount = models.FloatField()

    def as_json(self):
        return dict(id=self.id, project=self.project.id, user=self.user.username, 
            dossier=self.dossier.url if self.dossier else None, 
            date=str(self.date), concept=self.concept, 
            amount=self.amount, vatpercentage=self.vatpercentage, 
            final_amount=self.final_amount)
