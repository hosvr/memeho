const yaml = require("js-yaml");

function get_summary(tk_instances){
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
  const yaml_output = yaml.dump(yaml_summary, {"indent": 8})
  return yaml_output
}

module.exports = {
  get_summary
}