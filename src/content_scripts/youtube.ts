function getRootDomain(url: string) {
	const arr = url.split('.')
	return `${arr.at(-2)}.${arr.at(-1)}`
}

function t<T>(fn: () => T) {
	try {
		return fn()
	} catch (err: unknown) {
		console.error(err)
	}
}

function getYoutubeUnique() {
	const url = new URL(globalThis.location.href)
	const params = new URLSearchParams(url.search)

	const videoId = params.get('v')
	const channelName = t(() => {
		const el = document.querySelector(
			'.ytd-channel-name > a',
		) as HTMLAnchorElement
		return el?.innerText
	})

	const totalViews = t(() => {
		const el = document.querySelector('.view-count') as HTMLSpanElement
		return el?.innerText
	})

	const totalSubscribers = t(() => {
		const el = document.querySelector('#owner-sub-count') as HTMLElement
		return el?.innerText
	})
}

;(async () => {
	const currentDomain = getRootDomain(globalThis.location.hostname)

	if (currentDomain === 'youtube.com') {
		const uniqueId = getYoutubeUnique()
	}

	const kaxonOverlay = await (async () => {
		const templateUri = chrome.runtime.getURL('content_scripts/template.html')
		console.log(templateUri)
		let templateText
		try {
			templateText = await fetch(templateUri)
		} catch (err) {
			console.error(err)
			return undefined
		}

		console.log(templateText)

		const templateText5 = `
	<div>
		<h1>STUFFFFFF</h1>
	</div>
	`
		const templateEl = document.createElement('template')
		templateEl.innerHTML = templateText5

		return templateEl.content.cloneNode(true)
	})()

	console.log('j', kaxonOverlay)
	document.body.appendChild(kaxonOverlay)

	document.addEventListener('keydown', (ev) => {
		if (ev.ctrlKey && ev.altKey && ev.shiftKey && ev.code === 'KeyK') {
			console.log('hotkey activated', ev)
		}
	})
})()
