module.exports = {
  name: "interactionCreate",
  run: async(bot, interaction) => {
    if (!interaction.isCommand()) return 

    const slashcmd = bot.client.slashcommands.get(interaction.commandName)
    if (!slashcmd) return interaction.reply("Invalid slash command")

    if (slashcmd.perm && !interaction.member.permissions.has(slashcmd.perm))
        return interaction.reply("You do not have permission for this command")

    slashcmd.run(bot, interaction)
  }
}
