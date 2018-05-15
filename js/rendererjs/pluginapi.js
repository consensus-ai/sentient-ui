// pluginapi.js: Sentient-UI plugin API interface exposed to all plugins.
// This is injected into every plugin's global namespace.
import * as Sentientd from 'sentient.js'
import { remote } from 'electron'
import React from 'react'
import DisabledPlugin from './disabledplugin.js'
import Path from 'path'

const dialog = remote.dialog
const mainWindow = remote.getCurrentWindow()
const config = remote.getGlobal('config')
const sentientdConfig = config.sentientd
const fs = remote.require('fs')
let disabled = false

const sleep = (ms = 0) => new Promise((r) => setTimeout(r, ms))

window.onload = async function() {
	// ReactDOM needs a DOM in order to be imported,
	// but the DOM is not available until the plugin has loaded.
	// therefore, we have to global require it inside the window.onload event.

	/* eslint-disable global-require */
	const ReactDOM = require('react-dom')
	/* eslint-enable global-require */

	let startSentientd = () => {}

	const renderSentientdCrashlog = () => {
		// load the error log and display it in the disabled plugin
		let errorMsg = 'Sentientd exited unexpectedly for an unknown reason.'
		try {
			errorMsg = fs.readFileSync(Path.join(sentientdConfig.datadir, 'sentientd-output.log'), {'encoding': 'utf-8'})
		} catch (e) {
			console.error('error reading error log: ' +  e.toString())
		}

		document.body.innerHTML = '<div style="width:100%;height:100%;" id="crashdiv"></div>'
		ReactDOM.render(<DisabledPlugin errorMsg={errorMsg} startSentientd={startSentientd} />, document.getElementById('crashdiv'))
	}

	startSentientd = () => {
		const sentientdProcess = Sentientd.launch(sentientdConfig.path, {
			'sen-directory': sentientdConfig.datadir,
			'rpc-addr': sentientdConfig.rpcaddr,
			'api-addr': sentientdConfig.address,
			'modules': 'gctmw',
		})
		sentientdProcess.on('error', renderSentientdCrashlog)
		sentientdProcess.on('close', renderSentientdCrashlog)
		sentientdProcess.on('exit', renderSentientdCrashlog)
		window.sentientdProcess = sentientdProcess
	}
	// Continuously check (every 2000ms) if sentientd is running.
	// If sentientd is not running, disable the plugin by mounting
	// the `DisabledPlugin` component in the DOM's body.
	// If sentientd is running and the plugin has been disabled,
	// reload the plugin.
	while (true) {
		const running = await Sentientd.isRunning(sentientdConfig.address)
		if (running && disabled) {
			disabled = false
			window.location.reload()
		}
		if (!running && !disabled) {
			disabled = true
			renderSentientdCrashlog()
		}
		await sleep(2000)
	}
}


window.SentientAPI = {
	call: function(url, callback) {
		Sentientd.call(sentientdConfig.address, url)
		    .then((res) => callback(null, res))
				.catch((err) => callback(err, null))
	},
	config: config,
	hastingsToSen: Sentientd.hastingsToSen,
	senToHastings: Sentientd.senToHastings,
	openFile: (options) => dialog.showOpenDialog(mainWindow, options),
	saveFile: (options) => dialog.showSaveDialog(mainWindow, options),
	showMessage: (options) => dialog.showMessageBox(mainWindow, options),
	showError: (options) => dialog.showErrorBox(options.title, options.content),
}
