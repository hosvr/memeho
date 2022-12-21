const { formatOutput } = require('./helpers') 

function tk_list(tkdata, wipe){
  // get tk instances for specified wipe
  const tk_instances = tkdata.filter(i => i.wipe == wipe)
  const output = formatOutput(tk_instances, wipe)
  return { content: output, ephemeral: false }
}

module.exports = {
  tk_list
}