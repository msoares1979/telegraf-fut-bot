const Telegraf = require('telegraf')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')

class FutMatch {
    constructor () {
        var d = new Date()
        d.setDate(d.getDate() + (2 + 7 - d.getDay()) % 7);
        this.mTitle = `FutStark ${d.getDate()}/${d.getMonth() + 1} 20h`

        this.mConfirmed = []

        Object.getOwnPropertyNames(FutMatch.prototype)
          .filter((key) => key !== 'constructor' && typeof this[key] === 'function')
          .forEach((key) => (this[key] = this[key].bind(this)))
    }

    get title () {
        return this.mTitle
    }

    set title (value) {
        this.mTitle = value
    }

    get confirmed () {
        return this.mConfirmed
            .filter((v) => v.confirmed === true)
            .map((v) => v.name)
    }

    get absent () {
        return this.mConfirmed
            .filter((v) => v.confirmed === false)
            .map((v) => v.name)
    }

    confirm (name) {
        console.log(`'${name}'`, 'confirmed')
        this.mConfirmed = this.mConfirmed.filter((v) => v.name != name)
        this.mConfirmed.push({'name': name, 'confirmed': true})
    }

    unconfirm (name) {
        console.log(`'${name}'`, 'unconfirmed')
        this.mConfirmed = this.mConfirmed.filter((v) => v.name != name)
        this.mConfirmed.push({'name': name, 'confirmed': false})
    }

    clear () {
        this.mConfirmed.length = 0
    }

    toString () {
        var c = this.confirmed
        var a = this.absent

        return `*${this.title}*\nConfirmados (${c.length}): ` + c + '\n' + 'Ausentes: ' + a
    }
}

const match = new FutMatch()

const StartPanel = Markup.inlineKeyboard([
    Markup.callbackButton('Confirmado', 'confirmado'),
    Markup.callbackButton('Ausente', 'ausente')
])

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.command('convocar', (ctx) => ctx.reply('Quem vai?', Extra.markup(StartPanel)))
bot.action('confirmado', ({ update, replyWithMarkdown }) => {
    match.confirm(update.callback_query.from.first_name)
    replyWithMarkdown(match.toString())
})
bot.action('ausente', ({ update, replyWithMarkdown }) => {
    match.unconfirm(update.callback_query.from.first_name)
    replyWithMarkdown(match.toString())
})

bot.command('lista', (ctx) => ctx.replyWithMarkdown(match.toString()))
bot.command('confirmado', (ctx) => {
    names = ctx.message.text.replace('/confirmado', '').trim().split(',')
    if (names[0] === '')
        names[0] = ctx.message.from.first_name
    names.forEach((name) => match.confirm(name.trim()))
    ctx.replyWithMarkdown(match.toString())
})
bot.command('ausente', (ctx) => {
    names = ctx.message.text.replace('/ausente', '').trim().split(',')
    if (names[0] === '')
        names[0] = ctx.message.from.first_name
    names.forEach((name) => match.unconfirm(name.trim()))
    ctx.replyWithMarkdown(match.toString())
})
bot.command('limpar', (ctx) => {
    match.clear()
    ctx.replyWithMarkdown(match.toString())
})
bot.command('titulo', (ctx) => {
    match.title = ctx.message.text
    ctx.replyWithMarkdown(match.toString())
})

bot.use((ctx, next) => {
    //ctx.state.role = getUserRole(ctx.message)
    console.log(`${ctx.state.role} ${ctx.message.from.first_name} ${ctx.message.text}`)
    // Check permission towards RoleId
    return next()
})
bot.launch()
