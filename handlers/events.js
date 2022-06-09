const { getFiles, deleteCache } = require("../util/functions")

// Event listeners
function initEvents(bot){
  const { client } = bot
  client.once("ready", () => { triggerEventHandler(bot, "ready") })
  client.on("messageCreate", (message) => { triggerEventHandler(bot, "messageCreate", message) })
  client.on("interactionCreate", (interaction) => { triggerEventHandler(bot, "interactionCreate", interaction) })
}

function triggerEventHandler(bot, event, ...args){
  const { client } = bot

  try {
      if (!client.events.has(event)){ throw new Error(`Event "${event}" does not exist`) }
      client.events.get(event).run(bot, ...args)
  } catch(err) {
    console.error(err)
  }
}

module.exports = (bot, reload) => {
  const { client } = bot

  let events = getFiles("./events/", ".js")
  if (events.length ===0){ console.log("No events to load"); return }

  events.forEach((f) => {
    if (reload) { deleteCache(`../events/${f}`) }
  
    const event = require(`../events/${f}`)
    client.events.set(event.name, event)
  })

  if (!reload){ initEvents(bot) }
  console.log(`Events loaded: ${events}`)
}
