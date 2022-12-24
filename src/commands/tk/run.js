const { tk_list, tk_user, tk_add } = require('./subcommands')

const run = async(body, env) => {
  // Limit usage
  // if (body.channel_id !== env.tarkov_channel_id){
  //   return { content:"The `/tk` slash command can only be used in the Tarkov channel", ephemeral: true }
  // }
  if (!body.member.roles.includes(env.tarkov_role_id)){ 
    return { content: "Only guild members with the tarkov role may use this command", ephemeral: true }
  }

  let output = { content: `ERROR: Command "${subcommand}" failed to process`, ephemeral: true}
  switch(subcommand){
    case 'list':
      output = tk_list(body, env)
      break;
    case 'user':
      output = tk_user(body, env)
      break;
    case 'add':
      output = await tk_add(body, env)
      break;
    default:
      output = { content: `No valid subcommand was found: ${subcommand}`, ephemeral: true }
  }
  return output
}

module.exports ={
  run
}