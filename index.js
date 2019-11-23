const Telegraf = require('telegraf')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')

let match = {
    'titulo': '',
    'confirmed': [],
    'absent': []
}

const StartPanel = Markup.inlineKeyboard([
    Markup.callbackButton('Confirmado', 'confirmado'),
    Markup.callbackButton('Ausente', 'ausente')
])

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.command('convocar', (ctx) => ctx.reply('Quem vai?', Extra.markup(StartPanel)))
bot.action('confirmado', ({ update }) => console.log('Confirmado', update.callback_query.from))
bot.action('ausente', ({ update }) => console.log('Ausente', update.callback_query.from))

bot.command('lista', (ctx) => ctx.reply('Hello'))
bot.command('confirmado', (ctx) => ctx.reply('Hello'))
bot.command('ausente', (ctx) => ctx.reply('Hello'))
bot.command('titulo', (ctx) => ctx.reply('Hello'))
bot.use((ctx, next) => {
    //ctx.state.role = getUserRole(ctx.message)
    console.log(`${ctx.state.role} ${ctx.message.from.first_name} ${ctx.message.text}`)
    // Check permission towards RoleId
    return next()
})
bot.launch()
