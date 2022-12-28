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

let commands = []
var commandFiles = fs.readdirSync('./src/commands', { withFileTypes: true }).filter(f => f.isDirectory()).map(d => d.name)
commandFiles.forEach(f => commands.push(f))
console.log('Loaded commands: ', commands)

commands.forEach((command) => {
	const body = require(`./commands/${command}`)
	registerSlashCommands(guild_url, body)
	.then((response) => {
		console.log(response)})
	.catch((error) => {
		console.log("ERROR!: \n", error)
	})	
})
