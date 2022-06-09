const { syncEftUsers } = require("../util/tk")

module.exports = {
  name: "ready",
  run: async (bot) => {
    console.log(`${bot.client.user.tag} has logged in`)
    await bot.tables.teamKills.sync()
    await bot.tables.eftUsers.sync()
    syncEftUsers(bot.client, bot.tables.eftUsers)
  }
}
