async function tk_add(tkdata, tk_instance, TK_DATA){
  tkdata.push(tk_instance)
  const output = await TK_DATA.put("tk_instances_test", JSON.stringify(tkdata))
  console.log(output)
  return { content: output, ephemeral: false }
}

module.exports = {
  tk_add
}