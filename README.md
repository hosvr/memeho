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

* add a new command in the `src/commands` folder
* ensure that the command is imported into `src/handler.js` and `src/register.js`
* the command must export the properties at a minimum:
```
module.exports = {
  name: "command name",
  description: "command description",
}
```
more options are available under [Discord Application Commands](https://discord.com/developers/docs/interactions/application-commands)

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
