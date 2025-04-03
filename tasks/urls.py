from django.urls import path
from .views import list_tasks, create_tasks, delete_task, register, home, user_login, user_logout, user_home, user_home1, index, buttons, cards, utilitiesanimation, utilitiesborder, utilitiescolor, utilitiesother, charts, tables, modulo1, modulo2, test, results_view, save_score
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('login/', user_login, name='login'),
    path('signup/', register, name='signup'),
    path('logout/', user_logout, name='logout'),
    path('home/', user_home, name='home'),
    path('home1/', user_home1, name='home1'),
    path('index/', index, name='index'),
    path('buttons/', buttons, name='buttons'),
    path('cards/', cards, name='cards'),
    path('utilities-animation/', utilitiesanimation,name='utilities-animation'),
    path('utilities-border/', utilitiesborder, name='utilities-border'),
    path('utilities-color/', utilitiescolor, name='utilities-color'),
    path('utilities-other/', utilitiesother, name='utilities-other'),
    path('charts/', charts, name='charts'),
    path('tables/', tables, name='tables'),
    path('modulo1/', modulo1, name='modulo1'),
    path('modulo2/', modulo2, name='modulo2'),
    path('new/', create_tasks, name='create_task'),
    path('tasks/', list_tasks),
    path('delete_task/<int:task_id>/', delete_task, name='delete_task'),
    path('test/', test, name='test'),
    path('save_score/', save_score, name='save_score'),
    path('results/', results_view, name='results'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)