let port = chrome.runtime.connectNative('dev.kofler.kaxon.native')

port.onMessage.addListener((response) => {
	console.log('Received: ' + response)
})
console.log('Sending:  ping')
port.postMessage('ping')

chrome.runtime.onMessage.addListener((data) => {
	if (data.type === 'rpc') {
		port.postMessage(data)
	}
})
