# memeho

Discord bot for `memellenial city` server

* [deploy](#deploy)
* [commands](#commands) 
* [events](#events) 

# deploy

To deploy the bot, a secrets file `config.json` is required at the root directory. Create the file with the following information:

```
{
  "token": "exampleDiscordAuthToken",
  "guildId": "1234567890",
  "clientId": "1234567890",
  "dbUser": "superAdmin",
  "dbPassword": "letMeIn"
}
```

Ensure that the following directories are created: `/data`, `/commands`

# commands

Commands are created in the `/command` or the `/slashcommand` folder. A new `event` may also be needed for the bot to deploy the listener, see [events](#events) 

Schema boilerplate:
```
module.exports = {
  name: "ping",
  permissions: [],
  run: async ({message}) => {
    message.reply("Pong!")
  }
}
```

# events

Events are managed by the event handler and stored in the `/events` folder
1. Add the ``client.on(`${eventName}`, ())`` syntax into the `initEvents` function in the event handler `/handlers/events.js`
2. Create a new file `` `${eventName}.js` ``

Schema boilerplate:
```
module.exports = {
  name: "ready",
  run: async (bot) => {
    console.log(`${bot.client.user.tag} has logged in`)
  }
}
```

## Resources

* [Discord slash commands](https://discord.com/developers/docs/interactions/application-commands)
* [Discord slash command option types](https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-type)
* [Discord.js documentation](https://discord.js.org/#/docs/discord.js/stable/general/welcome)  
* [Niconiconii tutorial](https://youtube.com/playlist?list=PLOlSzPEdp-bRnCzZX6qnKehutm2nb_tN-)  
