const Telegraf = require('telegraf')
const TelegrafInlineMenu = require('telegraf-inline-menu')
const Markup = require('telegraf/markup')

const bot = new Telegraf('*****')

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

bot.action('WETTER-HEUTE', ctx => ctx.reply('In Münster ist es bis zum Nachmittag vielfach wolkig, gebietsweise kann sich auch die Sonne durchsetzen bei Werten von 14 bis zu 18°C. Am Abend wechseln sich in Münster Regen und trockene Phasen ab bei Werten von 14°C. In der Nacht bleibt die Wolkendecke geschlossen bei Tiefstwerten von 14°C.'))
bot.action('WETTER-MORGEN', ctx => ctx.reply('In Münster sind morgens anhaltende Schauer zu erwarten bei Temperaturen von 13°C. Später ist der Himmel bedeckt, die Sonne ist nicht zu sehen und die Temperatur steigt auf 17°C. Abends ist es regnerisch bei Temperaturen von 16 bis 17°C. In der Nacht gibt es Regen bei Tiefsttemperaturen von 15°C.'))
bot.on('location', (ctx) => ctx.reply('Danke für deinen Standort!'))
bot.hears('location', (ctx) => ctx.replyWithLocation(41.123,2.123))
bot.launch()