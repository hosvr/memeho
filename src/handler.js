import {InteractionResponseType, InteractionType} from 'discord-interactions'

export async function handleInteraction(body, request) {
  // mandatory discord validation
  if (body.type == InteractionType.PING) {
    return new Response(JSON.stringify({type: InteractionResponseType.PONG}))
  }

  if (body.type == InteractionType.APPLICATION_COMMAND) {
    return new Response(`OK`, {status: 200})
    // switch(json.data.name) {
    //   case 'echo':
    //     return new Response(
    //       JSON.stringify({
    //         type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    //         data: {
    //             tts: false,
    //             content: json.data.options[0].value, // we should be pulling based on the `name` property, actually
    //             embeds: [],
    //             allow_mentions: {parse: []},
    //         },
    //       }),
    //     )
    //   default:
    //     return new Response(
    //       JSON.stringify({
    //         type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    //         data: {
    //             tts: false,
    //             content: 'Sorry, we experienced a problem and a command was sent that doesn\'t exist!',
    //             embeds: [],
    //             allow_mentions: {parse: []},
    //         },
    //       }),
    //     )
    // }
  }
  return new Response(`request method: ${request.method}`)
}
