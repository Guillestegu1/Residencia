from django.shortcuts import render, redirect
from .models import Task, Score
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
import json
from django.db import models
from django.templatetags.static import static
from collections import defaultdict
from django.utils import timezone

# Create your views here.
def home(request):
    return render(request, 'home.html')

def register(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('home')
    else:
        form = UserCreationForm()
    return render(request, 'signup.html', {'form': form})

def user_login(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)

            # Obtener el puntaje total del usuario
            total_score = Score.objects.filter(user=user).aggregate(total= models.Sum('score'))['total'] or 0
            
            # Guardarlo en la sesión
            request.session['total_score'] = total_score

            return redirect('index')

    return render(request, 'login.html')

@login_required 
def save_score(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        module = data.get('module')
        score_value = data.get('score')

        puntaje_maximo = 500 # <-- usa el valor real que corresponda
        percentage = (score_value / puntaje_maximo) * 100

        Score.objects.create(
            user=request.user,
            module=module,
            score=score_value,
            percentage=percentage,
            date=timezone.now()
        )

        return JsonResponse({'status': 'success'})
    return JsonResponse({'status': 'error'}, status=400)

@login_required
def results_view(request):
    scores = Score.objects.filter(user=request.user).order_by('-date')  
    return render(request, 'results.html', {'scores': scores})

@login_required
def resultados(request):
    puntaje_maximo = 500

    user_scores = Score.objects.filter(user=request.user).order_by('module', '-date')
    scores_by_module = defaultdict(list)

    # Agrupar por módulo y agregar atributo temporal de porcentaje
    for score in user_scores:
        score.porcentaje = round((score.score / puntaje_maximo) * 100, 2)
        scores_by_module[score.module].append(score)

    # Calcular promedio por pares e impares por módulo
    porcentajes_modulares = []
    for module, scores in scores_by_module.items():
        scores_ordered = list(reversed(scores))  # Orden cronológico

        pares = scores_ordered[1::2]  # Índices 1, 3, ...
        impares = scores_ordered[0::2]  # Índices 0, 2, ...

        def promedio(qs):
            return round(sum(s.porcentaje for s in qs) / len(qs), 2) if qs else 0

        porcentajes_modulares.append({
            'module': module,
            'pares': promedio(pares),
            'impares': promedio(impares),
        })

    return render(request, 'resultados.html', {
        'scores_by_module': dict(scores_by_module),
        'porcentajes_modulares': porcentajes_modulares
    })


def user_logout(request):
    logout(request)
    return redirect('home')

def user_home(request):
    return render(request, 'home.html')

def user_home1(request):
    return render(request, 'home1.html')

def index(request):
    return render(request, 'index.html')
def buttons(request):
    return render(request, 'buttons.html')
def cards(request):
    return render(request, 'cards.html')

def utilitiesanimation(request):
    return render(request, 'utilities-animation.html')

def utilitiesborder(request):
    return render(request, 'utilities-border.html')

def utilitiescolor(request):
    return render(request, 'utilities-color.html')

def utilitiesother(request):
    return render(request, 'utilities-other.html')

def charts(request):
    return render(request, 'charts.html')

def tables(request):
    return render(request, 'tables.html')

def modulo1(request):
    return render(request, 'modulo1.html')

def modulo2(request):
    return render(request, 'modulo2.html')

def modulo3(request):
    return render(request, 'modulo3.html') 

def modulo4(request):
    return render(request, 'modulo4.html') 

def modulo5(request):
    return render(request, 'modulo5.html') 

def modulo6(request):
    return render(request, 'modulo6.html') 

def modulo7(request):
    return render(request, 'modulo7.html') 

def modulo8(request):
    return render(request, 'modulo8.html') 

def list_tasks(request):
    tasks = Task.objects.all()
    print(tasks)
    return render(request, 'list_tasks.html', {"tasks": tasks})
def create_tasks(request):
    task = Task(title=request.POST['title'], description=request.POST['description'])
    task.save()
    return redirect('/tasks/')

def delete_task(request, task_id):
    task = Task.objects.get(id=task_id)
    task.delete()
    return redirect('/tasks/')

def test(request):
    return render(request, "test.html")

def submodulo1(request):
    return render(request, 'submodulo1.html')
def submodulo2(request):
    return render(request, 'submodulo2.html')
def submodulo3(request):
    return render(request, 'submodulo3.html')
def submodulo4(request):
    return render(request, 'submodulo4.html')
def submodulo5(request):
    return render(request, 'submodulo5.html')
def submodulo6(request):
    return render(request, 'submodulo6.html')
def submodulo7(request):
    return render(request, 'submodulo7.html')
def submodulo8(request):
    return render(request, 'submodulo8.html')
def base2(request):
    return render(request, 'base2.html')
def tablas(request):
    return render(request, 'tablas.html')
