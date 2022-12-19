const { DISCORD_TOKEN, DISCORD_CLIENT_ID, DISCORD_GUILD_ID } = process.env
const tk = require('./commands/tk')

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

	if (response.status != '200'){
		return response.json()
	}
	return response.json()
}

registerSlashCommands(guild_url, tk).then((response) => {
	console.log(response)
	// console.log(`Name: ${response.name}, Id: ${response.id}`)
}).catch((error) => {
	console.log("ERROR!: \n", error)
})
