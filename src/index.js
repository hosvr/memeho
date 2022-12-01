import {verifyKey} from 'discord-interactions';
import {handleInteraction} from './handler';

export default {
	async fetch(request, env, ctx) {

		let method = request.method
		if (method != 'POST'){
			return new Response('',{status: 405})
		}

		// mandatory discord verification
		let signature = request.headers.get('x-signature-ed25519')
		let timestamp = request.headers.get('x-signature-timestamp')
		let isValidRequest = verifyKey(
			await request.clone().arrayBuffer(),
			signature,
			timestamp,
			env.CLIENT_PUB_KEY,
		)
		if (!isValidRequest){
			return new Response('Bad request signature', {status: 401})
		}
		
		let body = await request.json()
		console.log(body)
		return await handleInteraction(body, request)
	},
};
