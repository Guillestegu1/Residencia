from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Task(models.Model):
    title = models.CharField(max_length=100)
    description= models.TextField(blank=True)

class Score(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, default= 1)  # Relación con usuario
    module = models.CharField(max_length=100)  # Nombre del módulo (1-8)
    score = models.IntegerField()  # Puntaje obtenido
    date = models.DateTimeField(auto_now_add=True)  # Fecha en la que se guardó el puntaje

    def __str__(self):
        return f"User: {self.user.username}, Module: {self.module}, Score: {self.score}"