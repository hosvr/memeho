const { getFiles, deleteCache } = require("../util/functions")

module.exports = (bot, reload) => {
  const { client } = bot

  let commands = getFiles("./commands/", ".js")
  if (commands.length === 0){ console.log("No commands to load"); return }

  commands.forEach((f) => {
    if (reload){ deleteCache(`../commands/${f}`) }
    const command = require(`../commands/${f}`)
    client.commands.set(command.name, command)
  })

  console.log(`Commands loaded: ${commands}`)
}
