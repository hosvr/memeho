# memeho

Serverless application using Cloudflare workers to handle discord interactions

# wrangler config

* `wrangler login`
* `wrangler dev`
* `wrangler publish`

Secrets: `wrangler secret put DISCORD_PUBLIC_KEY`

# ci/cd

Github actions secrets: `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_TOKEN`

# Resources

* [Discord API](https://discord.com/developers/docs/reference)
* [Discord Application Commands](https://discord.com/developers/docs/interactions/application-commands)
* [Discord tutorial Cloudflare workers](https://discord.com/developers/docs/tutorials/hosting-on-cloudflare-workers)
