const Telegraf = require('telegraf')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')

class FutMatch {
    constructor (title) {
        this.mTitle = title
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
        this.mConfirmed = this.mConfirmed.filter((v) => v.name != name)

        this.mConfirmed.push({'name': name, 'confirmed': true})
    }

    unconfirm (name) {
        this.mConfirmed = this.mConfirmed.filter((v) => v.name != name)

        this.mConfirmed.push({'name': name, 'confirmed': false})
    }

    toString () {
        var c = this.confirmed
        var a = this.absent

        return `**${this.title}**\nConfirmados (${c.length}): ` + c + '\n' + 'Ausentes: ' + a
    }
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
