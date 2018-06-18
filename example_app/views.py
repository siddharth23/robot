from django.views.generic.base import TemplateView
from django.http import JsonResponse
from datetime import datetime
import requests
from chatterbot.trainers import ListTrainer
from urllib.parse import unquote
from chatterbot import ChatBot

bot = ChatBot("Shiv")
bot.set_trainer(ListTrainer)
file_data = open("example_app/static/training_data", "r").readlines()
bot.train(file_data)
bot2 = ChatBot("Sid", logic_adapters=[
    "chatterbot.logic.TimeLogicAdapter"
])


class ChatterBotAppView(TemplateView):
    template_name = "app.html"


def replace_all(text, dic):
    for i, j in dic.items():
        text = text.replace(i, j)
    return text


def command_view_new(request, *args, **kwargs):
    reqs = unquote(request.GET.get('value'))
    print(reqs)
    response = bot.get_response(reqs)
    if response.confidence > 0.7:
        return JsonResponse({"value": str(response)})
    else:
        return JsonResponse({"value": "Sorry can't understand you"})
