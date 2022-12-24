# memeho

Serverless application using Cloudflare workers to handle discord interactions

# wrangler config

* `wrangler login`
* `wrangler dev`
* `wrangler publish`

Secrets: `wrangler secret put SECRET_NAME`

# registering a slash command

* this is handled automatically in github actions
* manual steps if needed:
  * requires env variables: `DISCORD_TOKEN`, `DISCORD_CLIENT_ID`, `DISCORD_GUILD_ID`
  * run the register file `npm run register`

# creating a new command

* add a package in the `src/commands` folder
* currently the `src/handler.js` explicitly imports the tk package, the handler will need to accomadate for new commands
* the main package file must export the properties:
```
// can be seperated into a new file if there is a lot of logic
const run = async(body) => {
  // content = the response message to the user
  // ephemeral = whether the message should be a whisper(true) or public (false)
  return { content: content, ephemeral: true}
}

module.exports = {
  name: "command name",
  description: "command description",
  run
}
```

more options for types and subommands are available under [Discord Application Commands](https://discord.com/developers/docs/interactions/application-commands)

# ci/cd

Github actions secrets: 

* `DISCORD_TOKEN`
* `DISCORD_CLIENT_ID`
* `DISCORD_GUILD_ID`
* `CLOUDFLARE_TOKEN`

# resources

* [Discord API](https://discord.com/developers/docs/reference)
* [Discord Application Commands](https://discord.com/developers/docs/interactions/application-commands)
* [Discord tutorial Cloudflare workers](https://discord.com/developers/docs/tutorials/hosting-on-cloudflare-workers)
