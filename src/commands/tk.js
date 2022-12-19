const tarkovWipes = [
  { name: '2020-05-20', value: '2020-05-20' },
  { name: '2020-12-25', value: '2020-12-25' },
  { name: '2021-06-29', value: '2021-06-29' },
  { name: '2021-12-12', value: '2021-12-12' },
  { name: '2022-06-29', value: '2022-06-29' },
]

// const run = async(bot, interaction) => {
//   // Limit usage
//   if (interaction.channel.name !== "tarkov"){
//     return interaction.reply({ content:"The `/tk` slash command can only be used in the Tarkov channel", ephemeral: true })}
//   if(!interaction.member.roles.cache.some(r => r.name === "tarkov")){ 
//     return interaction.reply({content: "Only guild members with the tarkov role may use this command", ephemeral: true})}
  
//   const sub = interaction.options.getSubcommand()
//   currentWipe = '2022-06-29'
//   let output = {}

//   switch(sub){
//     case 'list':
//       output = await tkList(interaction, bot.tables.eftUsers, bot.tables.teamKills)
//       break;
//     case 'user':
//       output = await tkUser(interaction, bot.tables.eftUsers, bot.tables.teamKills)
//       break;
//     case 'add':
//       recordAuthor = interaction.member
//       tkAdd(interaction, bot.tables.eftUsers, bot.tables.teamKills, recordAuthor, bot.client.user.id, currentWipe)
//       return
//   }
//   return interaction.reply({content: output.content, ephemeral: output.ephemeral})
// }

module.exports = {
  name: "tk",
  description: "see EFT team kill data",
  options: [
    {
      "name": "list",
      "description": "see team kill summaries",
      "type": 1,
      "options": [
        {
          "name": "wipe",
          "description": "See team kill summary for previous wipes",
          "type": 3,
          "required": false,
          "choices": tarkovWipes
        }
      ]
    },
    {
      "name": "user",
      "description": "see the team kill summary for a user",
      "type": 1,
      "options": [
        {
          "name": "name",
          "description": "See team kill summary for specified user",
          "type": 6,
          "required": false
        }
      ]
    },
    {
      "name": "add",
      "description": "Add a team kill instance",
      "type": 1,
      "options": [
        {
          "name": "killer",
          "description": "discord member who TK'd",
          "type": 6,
          "required": true
        },
        {
          "name": "victim",
          "description": "discord member who ded",
          "type": 6,
          "required": true
        },
        {
          "name": "comment",
          "description": "any additional comments to add",
          "type": 3,
          "required": false
        }
      ]
    }
  ]
}