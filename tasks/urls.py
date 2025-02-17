from django.urls import path
from .views import list_tasks, create_tasks, delete_task, register, home, user_login, user_logout, user_home, user_home1
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('login/', user_login, name='login'),
    path('signup/', register, name='signup'),
    path('logout/', user_logout, name='logout'),
    path('home/', user_home, name='home'),
    path('home1/', user_home1, name='home1'),
    path('new/', create_tasks, name='create_task'),
    path('tasks/', list_tasks),
    path('delete_task/<int:task_id>/', delete_task, name='delete_task'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)