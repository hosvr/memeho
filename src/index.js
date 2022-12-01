import nacl from 'tweetnacl';
const Buffer = require('buffer/').Buffer;

async function handleRequest(request) {
  if (request.method === 'POST') {
    const req = await request.json()

    const headers = request.headers
    const PUBLIC_KEY = 'cd677acec866ef0eb5879773bdcb9bb4c27f283fb96d1d97428c733bf4545929'
    const signature = headers.get('X-Signature-Ed25519')
    const timestamp = headers.get('X-Signature-Timestamp')

    if (signature && timestamp) {
      const isVerified = nacl.sign.detached.verify(
        Buffer(timestamp + JSON.stringify(req)),
        Buffer(signature, 'hex'),
        Buffer(PUBLIC_KEY, 'hex'),
      )

      if (!isVerified) {
        return new Response(JSON.stringify(req), { status: 401 })
      } else {
        return new Response(JSON.stringify(req), { status: 200 })
      }
    }
  }

	if (request.method === 'GET') {
		return new Response('Hello World!', { status: 200 })
	}
}

addEventListener('fetch', event => {
	return event.respondWith((handleRequest(event.request)))
})
