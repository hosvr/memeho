const yaml = require("js-yaml");

const tarkovWipes = [
  { name: '2020-05-20', value: '2020-05-20' },
  { name: '2020-12-25', value: '2020-12-25' },
  { name: '2021-06-29', value: '2021-06-29' },
  { name: '2021-12-12', value: '2021-12-12' },
  { name: '2022-06-29', value: '2022-06-29' },
]

const tarkovChannelId = "706856018969231361"
const tarkovRole = "796051280451338241"
const currentWipe = '2022-06-29'

function tkList(tkdata, wipe){
  // get tk instances for specified wipe
  const tk_instances = tkdata.filter(i => i.wipe == wipe)
  const output = formatOutput(tk_instances, wipe)
  return { content: output, ephemeral: false }
}

function formatOutput(tk_instances, wipe){
  let tk_summary = {}
  // Unique list of killer ids
  const killer_ids = new Set()
  tk_instances.forEach(i => killer_ids.add(i.killer))

  // Determine victims and number of deaths per killer
  for (const killer of killer_ids){
    const teamKills = tk_instances.filter(i => killer === i.killer)

    // Unique list of victims per killer
    const victim_ids = new Set()
    teamKills.forEach(i => victim_ids.add(i.victim))

    let victim_summary = {}
    for (const victim of victim_ids){
      const deaths = teamKills.filter(i=> victim === i.victim).length
      victim_summary[`<@${victim}>`] = deaths
    }

    tk_summary[`<@${killer}>`] = victim_summary
  }

  const yaml_summary = yaml.load(JSON.stringify(tk_summary))
  const output = `Recorded Team kills for wipe ${wipe}\n${yaml.dump(yaml_summary, {"indent": 8})}`
  return output
}

const run = async(body, env) => {
  // Limit usage
  // if (body.channel_id !== tarkovChannelId){
  //   return { content:"The `/tk` slash command can only be used in the Tarkov channel", ephemeral: true }
  // }
  // if (!body.member.roles.includes(tarkovRole)){ 
  //   return { content: "Only guild members with the tarkov role may use this command", ephemeral: true }
  // }

  const tkdata = JSON.parse(await env.TKDATA.get("tkInstances"))
  const subcommand = body.data.options[0].name
  // const suboption = body.data.options[0].options[0].name

  let output = {}
  switch(subcommand){
    case 'list':
      let wipe = currentWipe
      if (body.data.options[0].options[0]) {
        wipe =  body.data.options[0].options[0].value
      }
      output = tkList(tkdata, wipe)
      break;
    // case 'user':
    //   // output = await tkUser(interaction, bot.tables.eftUsers, bot.tables.teamKills)
    //   break;
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