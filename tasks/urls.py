from django.urls import path
from .views import list_tasks, create_tasks, delete_task, register, home, user_login, user_logout, user_home, user_home1, index, buttons, cards, utilitiesanimation, utilitiesborder, utilitiescolor, utilitiesother, charts, tables, modulo1, modulo2, test, results_view, save_score, modulo3, modulo4, modulo5, modulo6, modulo7, modulo8, submodulo1, base2, tablas, resultados
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
    path('modulo3/', modulo3, name='modulo3'),
    path('modulo4/', modulo4, name='modulo4'), 
    path('modulo5/', modulo5, name='modulo5'),
    path('modulo6/', modulo6, name='modulo6'),
    path('modulo7/', modulo7, name='modulo7'),
    path('modulo8/', modulo8, name='modulo8'),
    path('new/', create_tasks, name='create_task'),
    path('tasks/', list_tasks),
    path('delete_task/<int:task_id>/', delete_task, name='delete_task'),
    path('test/', test, name='test'),
    path('save_score/', save_score, name='save_score'),
    path('results/', results_view, name='results'),
    path('submodulo1/', submodulo1, name='submodulo1'),
    path('base2/', base2, name='base2'),
    path('tablas/', tablas, name='tablas'),
    path('resultados/', resultados, name='resultados'),
    
]
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)