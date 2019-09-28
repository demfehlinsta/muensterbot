import requests
import json
from datetime import date

const Telegraf = require('telegraf')
const TelegrafInlineMenu = require('telegraf-inline-menu')
const Markup = require('telegraf/markup')

const bot = new Telegraf('*****')

def getWeather():
   request = requests.get('https://api.openweathermap.org/data/2.5/find?q=Münster,de&units=metric&appid=02d9e8792714ca986ca57f8c6ad0f407')
   data = json.loads(request.content)
   weather = data["list"][0]["main"]
   dict = {"title": "Heutiges Wetter in Münster", 
           "date": str(date.today()), 
           "location": data["list"][0]["coord"], 
           "source": "weather",
           "message": f"Momentan ca. {weather['temp']}°C\nTemperaturen zwischen {weather['temp_min']}°C-{weather['temp_max']}°C\nWindgeschwindigkeit: {data['list'][0]['wind']['speed']}km/h\nLuftfeuchtigkeit: {weather['humidity']}%"}
   return dict

def parseNum(s):
    ret = ""
    for x in s:
        if(x.isdigit()):
            ret += x
    return ret

#Freie Plätze der Parkhäuser in der Reihenfolge von https://www.wbi-muenster.de/parken-in-muenster/uebersicht.php
def getParkhaus():
   ret = []
   request = str(requests.get('https://www.wbi-muenster.de/parken-in-muenster/uebersicht.php').content)
   pos = request.find("<h4")+3
   while(pos != 2):
       ret.append(parseNum(request[pos:pos+30]))
       request = request[pos:]
       pos = request.find('<h4')+3
   return ret

bot.start(ctx => {
    ctx.reply(`Willkommen beim Münsterbot, ${ctx.from.first_name}!`,
    Markup.inlineKeyboard([
        Markup.callbackButton("Wetter", 'WETTER'),
        Markup.callbackButton("Parkhäuser", "PARKHAUS")
    ]).extra())
})

bot.action('WETTER', ctx => {
    ctx.reply('Für wann möchtest du das Wetter wissen?',
    Markup.inlineKeyboard([
        Markup.callbackButton("Heute", "WETTER-HEUTE"),
        Markup.callbackButton("Morgen", "WETTER-MORGEN"),
    ]).extra())
})

#bot.action('WETTER-HEUTE', ctx => ctx.reply('In Münster ist es bis zum Nachmittag vielfach wolkig, gebietsweise kann sich auch die Sonne durchsetzen bei Werten von 14 bis zu 18°C. Am Abend wechseln sich in Münster Regen und trockene Phasen ab bei Werten von 14°C. In der Nacht bleibt die Wolkendecke geschlossen bei Tiefstwerten von 14°C.'))

bot.action('WETTER-HEUTE', ctx => ctx.reply(getWeather()['message'])
           
bot.action('WETTER-MORGEN', ctx => ctx.reply('In Münster sind morgens anhaltende Schauer zu erwarten bei Temperaturen von 13°C. Später ist der Himmel bedeckt, die Sonne ist nicht zu sehen und die Temperatur steigt auf 17°C. Abends ist es regnerisch bei Temperaturen von 16 bis 17°C. In der Nacht gibt es Regen bei Tiefsttemperaturen von 15°C.'))
bot.on('location', (ctx) => ctx.reply('Danke für deinen Standort!'))
bot.hears('location', (ctx) => ctx.replyWithLocation(41.123,2.123))
bot.launch()
