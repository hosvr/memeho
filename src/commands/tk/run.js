const { tk_list } = require('./list')
const { tker_stats } = require('./user')
const { tk_add } = require('./add')

const run = async(body, env) => {
  // Limit usage
  // if (body.channel_id !== env.tarkov_channel_id){
  //   return { content:"The `/tk` slash command can only be used in the Tarkov channel", ephemeral: true }
  // }
  if (!body.member.roles.includes(env.tarkov_role_id)){ 
    return { content: "Only guild members with the tarkov role may use this command", ephemeral: true }
  }

  const tkdata = JSON.parse(await env.TK_DATA.get("tk_instances_test"))
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
    case 'add':
      const tk_instance_info = body.data.options[0].options
      const killer = tk_instance_info.find(o => o.name === "killer").value
      const victim = tk_instance_info.find(o => o.name === "victim").value
      const date = new Date()

      let comment = ""
      const comment_object = tk_instance_info.find(o => o.name === "comment")
      if (comment_object) { comment = comment_object.value }

      const tk_instance = { 
        "killer": killer,
        "victim": victim,
        "wipe": env.tarkov_current_wipe,
        "comment": comment,
        "date": date
      }

      output = await tk_add(tkdata, tk_instance, env.TK_DATA)
      // recordAuthor = interaction.member
      // tkAdd(interaction, bot.tables.eftUsers, bot.tables.teamKills, recordAuthor, bot.client.user.id, currentWipe)
      break;
    default:
      output = { content: `No valid subcommand was found: ${subcommand}`, ephemeral: true }
  }

  return output
}

module.exports ={
  run
}