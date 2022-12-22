const { get_summary } = require('./helpers') 

function tker_stats(tkdata, tker){
  // get teamkill data for specified user
  const tk_instances = tkdata.filter(i => i.killer == tker)
  const summary = get_summary(tk_instances)
  const output = `Total team kills for ${summary}`
  return { content: output, ephemeral: false }
}

module.exports = {
  tker_stats
}
