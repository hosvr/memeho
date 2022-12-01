# memeho

Serverless application using Cloudflare workers to handle discord interactions

# wrangler config

* `wrangler login`
* `wrangler dev`
* `wrangler publish`

# default index

```
export default {
	async fetch(request, env, ctx) {
		return new Response(`Hello World!`);
	},
};

```