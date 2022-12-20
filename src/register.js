const { DISCORD_TOKEN, DISCORD_CLIENT_ID, DISCORD_GUILD_ID } = process.env
const fs = require('node:fs')

const global_url = `https://discord.com/api/v10/applications/${DISCORD_CLIENT_ID}/commands`;
const guild_url = `https://discord.com/api/v10/applications/${DISCORD_CLIENT_ID}/guilds/${DISCORD_GUILD_ID}/commands`;

async function registerSlashCommands(url, body) {
	const response = await fetch(url, {
		body: JSON.stringify(body),
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization' : `Bot ${DISCORD_TOKEN}`
		}
	})
	return response.json()
}

// load commands from /src/commands
var commands = fs.readdirSync('./src/commands').filter(f => f.endsWith('.js'))
console.log('Loaded commands: ', commands)

commands.forEach((command) => {
	const commandBody = require(`./commands/${command}`)
	registerSlashCommands(guild_url, commandBody)
	.then((response) => {
		console.log(response)})
	.catch((error) => {
		console.log("ERROR!: \n", error)
	})	
})
