import {InteractionResponseType, InteractionType, InteractionResponseFlags} from 'discord-interactions'
const tk = require('./commands/tk')

export async function handleInteraction(body, env) {
  // mandatory discord validation
  if (body.type == InteractionType.PING) {
    return new Response(JSON.stringify({type: InteractionResponseType.PONG}))
  }

  // allow slashcommands only
  if (body.type != InteractionType.APPLICATION_COMMAND) {
    console.log(`Invalid interaction type received: type ${body.type}`)
    return new Response('Invalid interaction received', {status: 400})
  }

  const command = await tk.run(body, env)
  var ephemeralFlag = InteractionResponseFlags.EPHEMERAL
  if (command.ephemeral === false){ ephemeralFlag = 0 }

  let response = JSON.stringify({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      tts: false,
      content: command.content,
      embeds: [],
      allow_mentions: {
        parse: ["users"],
        users: [body.member.user.id]
      },
      flags: ephemeralFlag
    }
  })

  return new Response(response, {headers: {'Content-type': 'application/json'}, status: 200})
}
