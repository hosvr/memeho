const { get_summary } = require('./helpers') 

function tk_list(tkdata, wipe){
  // get tk instances for specified wipe
  let tk_instances = tkdata
  if (wipe !== "all"){ tk_instances = tkdata.filter(i => i.wipe == wipe) }
  const summary = get_summary(tk_instances, wipe)
  const output = `Recorded team kills for wipe ${wipe}:\n${summary}`
  return { content: output, ephemeral: false }
}

module.exports = {
  tk_list
}