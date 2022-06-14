const { Client, Collection } = require('discord.js')
const Sequelize = require('sequelize');

const { token, dbUser, dbPassword } = require('./config.json')
const { deploySlashCommands } = require('./util/functions')

const client = new Client({ intents: [ "GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS" ] });

const sequelize = new Sequelize('tarkovData', dbUser, dbPassword, {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: './data/tarkovData.sqlite',
});

const eftUsers = require("./models/eftUser.js")(sequelize)
const teamKills = require("./models/teamKill.js")(sequelize)
const tables = { eftUsers, teamKills }

let bot = {
	client,
	sequelize,
	tables
}

client.commands = new Collection()
client.events = new Collection()
client.slashcommands = new Collection()

client.loadEvents = (bot, reload) => { require("./handlers/events")(bot, reload) }
client.loadCommands = (bot, reload) => { require("./handlers/commands")(bot, reload) }
client.loadSlashCommands = (bot, reload) => { require("./handlers/slashcommands")(bot, reload) }

client.loadEvents(bot, false)
client.loadCommands(bot, false)
client.loadSlashCommands(bot, false)

deploySlashCommands(client)

module.exports = bot
client.login(token);

