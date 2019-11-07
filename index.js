const Telegraf = require('telegraf')

let match = {
    'titulo': '',
    'confirmed': [],
    'absent': []
}

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.command('lista', (ctx) => ctx.reply('Hello'))
bot.command('confirmado', (ctx) => ctx.reply('Hello'))
bot.command('ausente', (ctx) => ctx.reply('Hello'))
bot.command('titulo', (ctx) => ctx.reply('Hello'))
bot.launch()
