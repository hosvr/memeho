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

const tkAdd = async(interaction, eftUsers, teamKills, recordAuthor, botId, currentWipe) => {
  const killer = interaction.options.getUser("killer")
  const victim = interaction.options.getUser("victim")
  let comment = interaction.options.getString("comment")

  // Check for valid killer and victim
  const validKiller = await isEftUser(eftUsers, killer)
  if(!validKiller){
    return interaction.reply({ content: `${killer} is not a valid tarkov member, please ensure the user has the tarkov role`, ephemeral: true })
  }
  const validVictim = await isEftUser(eftUsers, victim)
  if(!validVictim){
    return interaction.reply({ content: `${victim} is not a valid tarkov member, please ensure the user has the tarkov role`, ephemeral: true })
  }
  if(!comment){ comment = `no comment added` }

  // Initial Bot reply
  content = `Pending record: ${killer} -> ${victim} (${comment})`
  message = await interaction.reply({content: content, ephemeral: false, fetchReply: true})
  await message.react('👍')

  // Listen for approvals
  const filter = (reaction, user) => { return reaction.emoji.name === '👍' && user.id != botId }
  const collector = message.createReactionCollector({ filter, time: 1000 * 60 * 15 });

  let approvals = []
  let approved = false
  collector.on('collect', async(reaction, user) => {
    // Approvals cannot come from author
    if (user.id == recordAuthor.id){ return }

    // Either participant in the TK instance can approve for instant approval
    if (user.id == killer.id || user.id == victim.id){
      approvals.push(user.username)
      approved = true
      collector.stop("TK participant has approved")
    }

    // Any other tarkov members can approve
    tarkovMember = await isEftUser(eftUsers, user)
    if(tarkovMember){
      approvals.push(user.username)
      return
    }
    
    // Approve if at least 2 non-participants approve
    if(approvals.length>=2){
      approved = true
      collector.stop("Approval numbers have been reached")
      return
    }
  });

  collector.on('end', async(collected) => {
    if(!approved){ return message.reply("Team kill instance not recorded: not enough approvals") }
    if(approved){ 
      console.log(`TeamKill instance approved: ${approvals}`)
      const tkAddInstance = await teamKills.create({
        killer: killer.id,
        victim: victim.id,
        comment: comment,
        wipe: currentWipe
      })
      console.log(`Team kill instance recorded: ${content}`)
      return message.reply("Team kill instance recorded") 
    }
  });

  return
}

module.exports = {
  tkAdd,
  tkList,
  tkUser,
  syncEftUsers
}
