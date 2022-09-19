import * as browser from 'webextension-polyfill'

//
;(async () => {
	addListenerToPageChange(() => {
		updateOverlay()
	})

	await addOverlay()
	updateOverlay()

	document.addEventListener('keydown', (ev) => {
		if (ev.ctrlKey && ev.code === 'Semicolon') {
			const overlayEl = document.querySelector('.kaxon-overlay')
			overlayEl.classList.toggle('hide')
		}
	})
})()

async function addOverlay() {
	const templateText = `
<div class="kaxon">
	<div class="kaxon-overlay hide">
		<div class="kaxon-overlay-inner">
			<h1>Kaxon</h1>
				<div class="kaxon-container">
				<p class="kaxon-current-id"></p>
				<p class="kaxon-status"></p>
				<a href="kaxon:///">Open Kaxon</a>
			</div>
		</div>
	</div>
</div>
`
	const templateEl = document.createElement('template')
	templateEl.innerHTML = templateText

	const kaxonOverlay = templateEl.content.cloneNode(true)
	const targetEl = document.body
	targetEl.appendChild(kaxonOverlay)
}

function updateOverlay() {
	const rootDomain = getRootDomain(globalThis.location.hostname)
	if (rootDomain === 'youtube.com') {
		const uniqueId = getYoutubeData()

		const currentIdEl = document.querySelector(
			'.kaxon-current-id',
		) as HTMLParagraphElement
		if (currentIdEl) {
			currentIdEl.innerText = 'Current ID: ' + uniqueId.id
		}

		//
		browser.runtime.sendMessage({
			type: 'rpc',
			method: 'has-youtube-id',
			data: {
				id: uniqueId.id,
			},
		})
	}
}

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

// https://stackoverflow.com/a/46428962
function addListenerToPageChange(fn: () => void) {
	let oldHref = document.location.href
	globalThis.addEventListener('load', () => {
		let observer = new MutationObserver(function (mutations) {
			for (const _ of mutations) {
				if (oldHref != document.location.href) {
					oldHref = document.location.href

					fn()
				}
			}
		})

		let bodyEl = document.querySelector('body')
		observer.observe(bodyEl, {
			childList: true,
			subtree: true,
		})
	})
}
