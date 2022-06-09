// functions.js: general utilities for the discord bot

const fs = require("fs")
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9')

const { clientId, guildId, token } = require("../config.json");

const deleteCache = (path) => {
  delete require.cache[require.resolve(path)]
}

const deploySlashCommands = (client) => {
  const rest = new REST({ version: '9' }).setToken(token);
  rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: client.slashcommands })
    .then(() => {
      console.log(`Deploying slash commands: successfully deployed ${client.slashcommands.size} slash commands`)})
    .catch(console.error)
}

const getDisplayName = async(eftUsers, uid) => {
  const dn = await eftUsers.findOne({
    where: { userId: uid },
    attributes: ['displayName']
  })

  if (!dn){ return uid }
  return dn.dataValues.displayName
}

const getFiles = (path, extension) => {
  return fs.readdirSync(path).filter(f => f.endsWith(extension))
}

function getGuildMembers(client){
  return client.guilds.cache.get(guildId).members.fetch()
}

const writeFile = (fileName, jsonObject) => {
  fs.writeFileSync(`./data/${fileName}`, JSON.stringify(jsonObject), 'utf-8', (err) => {
    if (err){ console.error(err) }
  })
}

module.exports = {
  deleteCache,
  deploySlashCommands,
  getDisplayName,
  getFiles,
  getGuildMembers,
  writeFile
}
