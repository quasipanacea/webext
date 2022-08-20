let port = chrome.runtime.connectNative('dev.kofler.kaxon.native')
port.onMessage.addListener((response) => {
	console.info('got response:', response)
})

document.querySelector('.open')?.addEventListener('click', async (ev) => {
	port.postMessage('open-kaxon')
})
