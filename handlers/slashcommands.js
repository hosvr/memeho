const { getFiles, deleteCache } = require("../util/functions")

module.exports = (bot, reload) => {
  const { client } = bot
  
  let slashcommands = getFiles("./slashcommands/", ".js")
  if (slashcommands.length === 0){ console.log("No slashcommands to load"); return }

  slashcommands.forEach((f) => {
    if (reload){ deleteCache(`../slashcommands/${f}`) }

    const slashcmd = require(`../slashcommands/${f}`)
    client.slashcommands.set(slashcmd.name, slashcmd)
  })
  
  console.log(`Slashcommands loaded: ${slashcommands}`)
}
