from django.shortcuts import render, redirect
from .models import Task
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django.http import HttpResponse

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
            return redirect('index')
    return render(request, 'login.html')
    
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
