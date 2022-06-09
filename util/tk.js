// tk.js: utilities for working with the /tk slash command

const yaml = require("js-yaml");
const Sequelize = require('sequelize');
const { getDisplayName, getGuildMembers } = require("./functions")

const getTkSummary = async(eftUsers, teamKills, wipe) => {
  const tkSummary = {}
  const currentWipe = await (async() => {
    if(wipe){ return wipe } 
    else {
      const wipe = await teamKills.findAll({
        order: [[ 'wipe', 'DESC' ]],
        limit: 1
      }).then(r => r[0].dataValues.wipe )
      return wipe
    }
  })()
  
  // Unique list of killers
  const killerIds = new Set()
  await teamKills.findAll({
    attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('killer')), 'killer'],],
    where: { wipe: currentWipe }
  }).then(r => r.forEach(i => killerIds.add(i.dataValues.killer)))

  for (const kid of killerIds){
    const kidName = await getDisplayName(eftUsers, kid)

    // Unique list of victims per killer
    const victimIds = new Set()
    await teamKills.findAll({
      attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('victim')), 'victim'],],
      where: { wipe: currentWipe, killer: kid },
      raw: true
    }).then(r => r.forEach(i => victimIds.add(i.victim))) 

    const victims = {}
    for (let vid of victimIds){
      const victimName = await getDisplayName(eftUsers, vid)
      const deaths = await teamKills.count({
        where: { wipe: currentWipe, killer: kid, victim: vid }
      })
      victims[victimName] = deaths
    }

    tkSummary[kidName] = victims
  }

  const tkyaml = yaml.load(JSON.stringify(tkSummary))
  const output = `Recorded Team kills for wipe ${currentWipe}\n\`\`\`\n${yaml.dump(tkyaml, {"indent": 4})}\n\`\`\``
  return { content: output, ephemeral: false }
}

const getUserTeamKills = async(eftUsers, teamKills, user) => {
  const kidName = await getDisplayName(eftUsers, user.id)

  // Unique lit of victims for current killer
  const victimIds = new Set()
  await teamKills.findAll({
    attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('victim')), 'victim'],],
    where: { killer: user.id },
    raw: true
  }).then(r => r.forEach(i => victimIds.add(i.victim)))
  
  const victims = {}
  for (let vid of victimIds){
    const victimName = await getDisplayName(eftUsers, vid)
    const deaths = await teamKills.count({
      where: { killer: user.id, victim: vid }
    })
    victims[victimName] = deaths
  }

  const tkSummary = {}
  tkSummary[kidName] = victims
  const tkyaml = yaml.load(JSON.stringify(tkSummary))
  const output = `Total recorded team kills for ${user}\n\`\`\`\n${yaml.dump(tkyaml, {"indent": 4})}\n\`\`\``
  return { content: output, ephemeral: false }
}

const syncEftUsers = async(client, eftUsers) => {
  const guildMembers = await getGuildMembers(client)
  const tarkovMembers = await guildMembers.filter(m => m.roles.cache.some(r => r.name === "tarkov") === true)

  tarkovMembers.forEach(async(m) => {
    let displayName = m.user.username
    if (m.nickname){ displayName = m.nickname }

    const eftUser = await eftUsers.findOne({ where: { userId: m.user.id } });
    if (eftUser){ 
      if (displayName != eftUser.dataValues.displayName ) {
        eftUsers.update({ displayName: displayName}, { where: { userId: m.user.id } })
        console.log(`Updated ${m.user.id} with new nickname ${displayName}`)
      }
    } else {
      eftUsers.create({
        userId: m.user.id,
        displayName: displayName
      })
    }
  })
}

const isEftUser = async(eftUsers, user) => {
  const findUser = await eftUsers.findOne({ where: { userId: user.id } })
  if(findUser){ return true }
  return false
}

const tkList = async(interaction, eftUsers, teamKills) => {
  const wipe = interaction.options.getString("wipe")
  let output = await getTkSummary(eftUsers, teamKills, wipe)
  return output
}

const tkUser = async(interaction, eftUsers, teamKills) => {
  // Check if user is specified, if not, default to message sender
  let user = ""
  const specifiedUser = interaction.options.getUser("name")
  if (specifiedUser){ user = specifiedUser }
  else { user = interaction.member.user }

  // Check if specified user has tarkov role in server
  const validUser = await isEftUser(eftUsers, user)
  if(!validUser){ 
    let output = {}
    output = { content: `${user} is not a valid tarkov member, please ensure the user has the tarkov role`, ephemeral: true }
    return output
  }

  let output = await getUserTeamKills(eftUsers, teamKills, user)
  return output
}

const tkAdd = async(interaction, eftUsers, teamKills) => {
  // Check for valid killer and victim
  const killer = interaction.options.getUser("killer")
  const validKiller = await isEftUser(eftUsers, killer)
  if(!validKiller){
    let output = { content: `${killer} is not a valid tarkov member, please ensure the user has the tarkov role`, ephemeral: true }
    return output
  }
  const victim = interaction.options.getUser("victim")
  const validVictim = await isEftUser(eftUsers, victim)
  if(!validVictim){
    let output = { content: `${victim} is not a valid tarkov member, please ensure the user has the tarkov role`, ephemeral: true }
    return output
  }

  return { content: "placeholder add", ephemeral: false }
}

module.exports = {
  tkAdd,
  tkList,
  tkUser,
  syncEftUsers
}
