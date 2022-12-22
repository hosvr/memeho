const { tk_list } = require('./list')
const { tker_stats } = require('./user')

const tarkovWipes = [
  { name: '2020-05-20', value: '2020-05-20' },
  { name: '2020-12-25', value: '2020-12-25' },
  { name: '2021-06-29', value: '2021-06-29' },
  { name: '2021-12-12', value: '2021-12-12' },
  { name: '2022-06-29', value: '2022-06-29' },
]

const run = async(body, env) => {
  // Limit usage
  // if (body.channel_id !== env.tarkov_channel_id){
  //   return { content:"The `/tk` slash command can only be used in the Tarkov channel", ephemeral: true }
  // }
  // if (!body.member.roles.includes(env.tarkov_role_id)){ 
  //   return { content: "Only guild members with the tarkov role may use this command", ephemeral: true }
  // }

  const tkdata = JSON.parse(await env.TKDATA.get("tkInstances"))
  const subcommand = body.data.options[0].name

  let output = { content: `ERROR: Command "${subcommand}" failed to process`, ephemeral: true}
  switch(subcommand){
    case 'list':
      let wipe = env.tarkov_current_wipe
      
      let specified_wipe = body.data.options[0].options[0]
      if (specified_wipe) { wipe = specified_wipe.value }

      output = tk_list(tkdata, wipe)
      break;
    case 'user':
      let tker = body.member.user.id
      if (!tker){ output = { content: `No user found: \`\`\`${JSON.stringify(body.member,null, 2)}\`\`\`` }; break}
      
      let specified_tker = body.data.options[0].options[0]
      if (specified_tker){ tker = specified_tker.value }

      output = tker_stats(tkdata, tker)
      break;
    // case 'add':
    //   // recordAuthor = interaction.member
    //   // tkAdd(interaction, bot.tables.eftUsers, bot.tables.teamKills, recordAuthor, bot.client.user.id, currentWipe)
    //   return
    default:
      output = { content: `No valid subcommand was found: ${subcommand}`, ephemeral: true }
  }

  return output
}

module.exports = {
  run,
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