// src/commands/tk/util.js
// utility functions to assist subcommands

const yaml = require("js-yaml");

const get_tk_instances = async(env) => {
    const tk_instances = await env.TK_DATA.get("tk_instances", {type: "json"})
    return tk_instances
}

const write_tk_instance = async(body, env) => {
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

    const tk_instances = await get_tk_instances(env)
    tk_instances.push(tk_instance)

    try {
        const output = await env.TK_DATA.put("tk_instances", JSON.stringify(tk_instances))
        return { content: `new tk instance recorded: <@${killer}> -> <@${victim}>`, ephemeral: false }
    } catch(err) {
        console.error(err)
        return { content:`ERROR:! Unable to record tk instance`, ephemeral: true }
    }
}


function generate_summary(tk_instances){
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
    const yaml_output = yaml.dump(yaml_summary, {"indent": 4})
    return yaml_output
}

module.exports ={
    get_tk_instances,
    generate_summary,
    write_tk_instance
}