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
    // Convert to format: {killer: {victim: count}}
    let killer_map = tk_instances.reduce((x, i) => {
      if (!(i.killer in x)) x[i.killer] = {};
      !(i.victim in x[i.killer]) ? x[i.killer][i.victim] = 1 : x[i.killer][i.victim]++;
      return x;
    }, {});

    let output = [];
    for (const [x, y] of Object.entries(killer_map)){
      let victims = [];
      for (const [i, k] of Object.entries(y)){
          victims.push(`${i}: **${k}**`);
      }
      output.push(`**${x}**: ` + victims.join(', '));
    }
    return output.join('\r\n')
}

module.exports ={
    get_tk_instances,
    generate_summary,
    write_tk_instance
}