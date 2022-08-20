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

function getYoutubeData() {
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

	return {
		id: videoId,
		channelName,
		totalViews,
		totalSubscribers,
	}
}

;(async () => {
	const kaxonOverlay = await (async () => {
		// const templateUri = chrome.runtime.getURL('content_scripts/template.html')
		// console.log(templateUri)
		// let templateText
		// try {
		// 	templateText = await fetch(templateUri)
		// } catch (err) {
		// 	console.error(err)
		// 	return undefined
		// }
		const templateText = `
<div class="kaxon-overlay-outer">
	<div class="kaxon-overlay">
		<h1>Kaxon</h1>
			<div class="kaxon-container">
			<p class="kaxon-current-id"></p>
			<p class="kaxon-status"></p>
			<a href="kaxon:///">Open Kaxon</a>
		</div>
	</div>
</div>
`
		const templateEl = document.createElement('template')
		templateEl.innerHTML = templateText

		return templateEl.content.cloneNode(true)
	})()
	const targetEl = document.body
	targetEl.appendChild(kaxonOverlay)

	const currentDomain = getRootDomain(globalThis.location.hostname)
	if (currentDomain === 'youtube.com') {
		const uniqueId = getYoutubeData()

		//
		const currentIdEl = document.querySelector(
			'.kaxon-current-id',
		) as HTMLParagraphElement
		if (currentIdEl) {
			currentIdEl.innerText = 'Current ID: ' + uniqueId.id
		}

		//
		chrome.runtime.sendMessage({
			type: 'rpc',
			method: 'has-youtube-id',
			data: {
				id: uniqueId,
			},
		})
		// port.onMessage.addListener((response) => {
		// 	console.info('got response:', response)
		// })
		// console.log('----------------------------------------------')
		// port.postMessage(`yt-checkid:${uniqueId}`)

		const statusEl = document.querySelector('.kaxon-status')
	}

	document.addEventListener('keydown', (ev) => {
		if (ev.ctrlKey && ev.altKey && ev.shiftKey && ev.code === 'KeyK') {
			console.log('hotkey activated', ev)
		}
	})
})()
