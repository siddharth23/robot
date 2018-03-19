from django.views.generic.base import TemplateView
from django.http import JsonResponse
from datetime import datetime
import requests
from urllib.parse import unquote
class ChatterBotAppView(TemplateView):
    template_name = "app.html"

def replace_all(text, dic):
    for i, j in dic.items():
        text = text.replace(i, j)
    return text

def calculate_view(request, *args, **kwargs):
    reqs=unquote(request.GET.get('value'))
    print(reqs)
    t={"into":"*","cross":"*","multiply":"*","divide":"/","divide by":"/","divided by":"/","divided":"/","power":"**","square root":"** 0.5","cube root":"** round(float(1/3),2)"}
    sts=replace_all(reqs,t)
    x=""
    if(reqs.startswith('time')):
        x=eval("datetime."+reqs.replace("time","").replace(" ","")+"()")
    else:
        x=eval(sts)
    return JsonResponse({'result':str(x)})

def eslc_view(request, *args, **kwargs):
    reqs = unquote(request.GET.get('value'))
    resp=requests.get("https://reqres.in/api/users/2")
    if resp.status_code == 200:
        return JsonResponse({'result': str(reqs)+" successful"})
    else:
        return JsonResponse({'result': str(reqs) + " not successful"})