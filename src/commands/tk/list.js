const { format_output } = require('./helpers') 

function tk_list(tkdata, wipe){
  // get tk instances for specified wipe
  const tk_instances = tkdata.filter(i => i.wipe == wipe)
  const output = format_output(tk_instances, wipe)
  return { content: output, ephemeral: false }
}

module.exports = {
  tk_list
}