// src/commands/tk/subcommands.js
// subcommand execution for tk

const yaml = require("js-yaml");
const { get_tk_instances, write_tk_instance, generate_summary } = require('./util')

function tk_list(body, env){
  let wipe = env.tarkov_current_wipe

  let specified_wipe = body.data.options[0].options[0]
  if (specified_wipe) { wipe = specified_wipe.value }

  // get tk instances for specified wipe
  let tk_instances = get_tk_instances(env)
  if (wipe !== "all"){ tk_instances = tk_instances.filter(i => i.wipe == wipe) }

  const summary = generate_summary(tk_instances, wipe)
  const output = `Recorded team kills for wipe ${wipe}:\n${summary}`
  return { content: output, ephemeral: false }
}

function tk_user(body, env){
  let tker = body.member.user.id
  if (!tker){ return {content: `No user found: \`\`\`${JSON.stringify(body.member,null, 2)}\`\`\``} }
  
  let specified_tker = body.data.options[0].options[0]
  if (specified_tker){ tker = specified_tker.value }
    
// get teamkill data for specified user
  const tk_instances = get_tk_instances(env).filter(i => i.killer == tker)

  const summary = generate_summary(tk_instances)
  const output = `Total team kills for ${summary}`
  return { content: output, ephemeral: false }
}

async function tk_add(body, env){
  const output = await write_tk_instance(body, env)
  console.log("tk_add: ", output)
  return { content: output, ephemeral: false }
}


module.exports = {
    tk_list,
    tk_user,
    tk_add
}