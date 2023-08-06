const url = 'https://script.google.com/macros/s/AKfycbyNVTMvxD73XXLc3uYjUuVIpspyqufe7VClCVwY57LCoxbaOcT44eHf6n4awAywWw5yeg/exec';

addEventListener("scheduled", (event) => {
	event.waitUntil(handleCron());
});

async function handleCron() {

	const resp = await fetch(url);
	const quotes = await resp.json();
	const quotesText = JSON.stringify(quotes.data)

	await qdb.put("quotes", quotesText)

};

addEventListener('fetch', event => {
	event.respondWith(update());
});

async function update() {
	async function gatherResponse(response) {
		const { headers } = response;
		const contentType = headers.get("content-type") || "";
		if (contentType.includes("application/json")) {
			return JSON.stringify(await response.json());
		}
		return response.json();
	}

	const init = {
		headers: {
			"content-type": "application/json;charset=UTF-8",
		},
	};

	const response = await fetch(url, init);
	const results = await gatherResponse(response);

	return new Response(JSON.stringify(results['data']), init);
}





