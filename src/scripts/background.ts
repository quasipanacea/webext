import * as browser from 'webextension-polyfill'

let port = browser.runtime.connectNative('dev.kofler.quasipanacea.native')

browser.runtime.onMessage.addListener((data) => {
	console.log('in rpc', data)

	if (data.type === 'rpc') {
		console.log('RPC', data)

		port.postMessage(data)
	}
})
