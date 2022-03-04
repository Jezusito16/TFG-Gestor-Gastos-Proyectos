from xml.etree.ElementInclude import include
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('endpoints.urls')),
    path('', include('mainpage.urls')),
    path('', include('users.urls'))
]