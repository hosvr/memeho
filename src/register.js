export async function registerCommands(env) {
  let global_url = `https://discord.com/api/v10/applications/${env.DISCORD_CLIENT_ID}/commands`;
  let guild_url = `https://discord.com/api/v8/applications/${env.DISCORD_CLIENT_ID}/guilds/${env.DISCORD_GUILD}/commands`;

  await fetch(guild_url, {
    body: JSON.stringify({
    
    }),
    method: POST,
    headers: {
      'Content-type': 'application/json',
      'Authorization': `Bearer ${(await getClientCredentialToken())}`
    }
  })
}