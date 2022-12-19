import {InteractionResponseType, InteractionType, InteractionResponseFlags} from 'discord-interactions'

export async function handleInteraction(body, request) {
  // mandatory discord validation
  if (body.type == InteractionType.PING) {
    return new Response(JSON.stringify({type: InteractionResponseType.PONG}))
  }

  // allow slashcommands only
  if (body.type != InteractionType.APPLICATION_COMMAND) {
    console.log(`Invalid interaction type received: type ${body.type}`)
    return new Response('Invalid interaction received', {status: 400})
  }

  let response = JSON.stringify({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      tts: false,
      content: `<@${body.member.user.id}> tk commands are currently being reworked. Please be patient, you can check the progress at https://github.com/hosvr/memeho/tree/cfw`,
      embeds: [],
      allow_mentions: {
        parse: ["users"],
        users: [body.member.user.id]
      },
      flags: InteractionResponseFlags.EPHEMERAL
    }
  })

  return new Response(response, {headers: {'Content-type': 'application/json'}, status: 200})
}
