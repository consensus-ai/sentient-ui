// loadingScreen.js: display a loading screen until communication with Sentientd has been established.
// if an available daemon is not running on the host,
// launch an instance of sentientd using config.js.
import { remote, shell } from 'electron'
import * as Sentientd from 'sentient.js'
import Path from 'path'
import React from 'react'
import ReactDOM from 'react-dom'
import StatusBar from './statusbar.js'

const dialog = remote.dialog
const app = remote.app
const fs = remote.require('fs')
const config = remote.getGlobal('config')
const sentientdConfig = config.attr('sentientd')

const spinner = document.getElementById('loading-spinner')
const overlay = document.getElementsByClassName('overlay')[0]
const overlayText = overlay.getElementsByClassName('centered')[0].getElementsByTagName('p')[0]
const errorLog = document.getElementById('errorlog')
overlayText.textContent = 'Loading Sentient...'

const showError = (error) => {
	overlayText.style.display = 'none'
	errorLog.textContent = 'A critical error loading Sentient has occured: ' + error
	errorLog.style.display = 'inline-block'
	spinner.style.display = 'none'
}

// startUI starts a Sentient UI instance using the given welcome message.
// calls initUI() after displaying a welcome message.
const startUI = (welcomeMsg, initUI) => {
	// Display a welcome message, then initialize the ui
	overlayText.innerHTML = welcomeMsg

	// Construct the status bar component and poll for updates from Sentientd
	const updateSyncStatus = async function() {
		try {
			const consensusData = await Sentientd.call(sentientdConfig.address, {timeout: 500, url: '/consensus'})
			const gatewayData = await Sentientd.call(sentientdConfig.address, {timeout: 500, url: '/gateway'})
			ReactDOM.render(
				<StatusBar peers={gatewayData.peers.length}	synced={consensusData.synced} blockheight={consensusData.height} />,
				document.getElementById('statusbar')
			)
			await new Promise((resolve) => setTimeout(resolve, 5000))
		} catch (e) {
			await new Promise((resolve) => setTimeout(resolve, 500))
			console.error('error updating sync status: ' + e.toString())
		}
		updateSyncStatus()
	}

	updateSyncStatus()

	initUI(() => {
		overlay.style.display = 'none'
	})
}

// sentientdExists validates config's Sentient path.  returns a promise that is
// resolved with `true` if sentientdConfig.path exists or `false` if it does not
// exist.
const sentientdExists = () => new Promise((resolve) => {
	fs.stat(sentientdConfig.path, (err) => {
		if (!err) {
			resolve(true)
		} else {
			resolve(false)
		}
	})
})

// genesisFileExists validates config's Sentient path.  returns a promise that is
// resolved with `true` if sentientdConfig.path exists or `false` if it does not
// exist.
const genesisFileExists = () => new Promise((resolve) => {
	fs.stat(sentientdConfig.genesisfile, (err) => {
		if (!err) {
			resolve(true)
		} else {
			resolve(false)
		}
	})
})

// unexpectedExitHandler handles an unexpected sentientd exit, displaying the error
// piped to sentientd-output.log.
const unexpectedExitHandler = () => {
	try {
		const errorMsg = fs.readFileSync(Path.join(sentientdConfig.datadir, 'sentientd-output.log'))
		showError('Sentientd unexpectedly exited. Error log: ' + errorMsg)
	} catch (e) {
		showError('Sentientd unexpectedly exited.')
	}
}

// Check if Sentientd is already running on this host.
// If it is, start the UI and display a welcome message to the user.
// Otherwise, start a new instance of Sentientd using config.js.
export default async function loadingScreen(initUI) {
	// Create the Sentient data directory if it does not exist
	try {
		fs.statSync(sentientdConfig.datadir)
	} catch (e) {
		fs.mkdirSync(sentientdConfig.datadir)
	}
	// If Sentient is already running, start the UI with a 'Welcome Back' message.
	const running = await Sentientd.isRunning(sentientdConfig.address)
	if (running) {
		startUI('Welcome back', initUI)
		return
	}

	// check sentientdConfig.path, if it doesn't exist optimistically set it to the
	// default path
	if (!await sentientdExists()) {
		sentientdConfig.path = config.defaultSentientdPath
	}

	// check sentientdConfig.path, and ask for a new path if sentientd doesn't exist.
	if (!await sentientdExists()) {
		// config.path doesn't exist.  Prompt the user for sentientd's location
		dialog.showErrorBox('Sentientd not found', 'Sentient-UI couldn\'t locate sentientd.  Please navigate to sentientd.')
		const sentientdPath = dialog.showOpenDialog({
			title: 'Please locate sentientd.',
			properties: ['openFile'],
			defaultPath: Path.join('..', sentientdConfig.path),
			filters: [{ name: 'sentientd', extensions: ['*'] }],
		})
		if (typeof sentientdPath === 'undefined') {
			// The user didn't choose sentientd, we should just close.
			app.quit()
		}
		sentientdConfig.path = sentientdPath[0]
	}

	// check sentientdConfig.genesisfile, if it doesn't exist optimistically set it to the
	// default genesisfile
	if (!await genesisFileExists()) {
		sentientdConfig.genesisfile = config.defaultGenesisFile
	}

	// check sentientdConfig.genesisfile, and ask for a new genesisfile if it doesn't exist.
	if (!await genesisFileExists()) {
		// config.genesisfile doesn't exist. Prompt the user for location
		dialog.showErrorBox('Genesis file not found', 'Sentient-UI couldn\'t locate the genesis file.  Please navigate to it.')
		const genesisFilePaths = dialog.showOpenDialog({
			title: 'Please locate the genesis file.',
			properties: ['openFile'],
			defaultPath: Path.join('..', sentientdConfig.genesisfile),
			filters: [{ extensions: ['json'] }],
		})
		if (typeof genesisFilePaths === 'undefined') {
			// The user didn't choose sentientd, we should just close.
			app.quit()
		}
		sentientdConfig.genesisfile = genesisFilePaths[0]
	}

	// Launch the new Sentientd process
	try {
		const sentientdProcess = Sentientd.launch(sentientdConfig.path, {
			'sen-directory': sentientdConfig.datadir,
			'rpc-addr': sentientdConfig.rpcaddr,
			'api-addr': sentientdConfig.address,
			'genesis-file': sentientdConfig.genesisfile,
			'modules': 'gctmw',
		})
		sentientdProcess.on('error', (e) => showError('Sentientd couldnt start: ' + e.toString()))
		sentientdProcess.on('close', unexpectedExitHandler)
		sentientdProcess.on('exit', unexpectedExitHandler)
		window.sentientdProcess = sentientdProcess
	} catch (e) {
		showError(e.toString())
		return
	}

	// Set a timeout to display a warning message about long load times caused by rescan.
	setTimeout(() => {
		if (overlayText.textContent === 'Loading Sentient...') {
			overlayText.innerHTML= 'Loading can take a while after upgrading to a new version. Check the <a style="text-decoration: underline; cursor: pointer" id="releasenotelink">release notes</a> for more details.'

			document.getElementById('releasenotelink').onclick = () => {
				shell.openExternal('https://github.com/consensus-ai/sentient-network/releases')
			}
		}
	}, 30000)

	// Wait for this process to become reachable before starting the UI.
	const sleep = (ms = 0) => new Promise((r) => setTimeout(r, ms))
	while (await Sentientd.isRunning(sentientdConfig.address) === false) {
		await sleep(500)
	}
	// Unregister callbacks
	window.sentientdProcess.removeAllListeners('error')
	window.sentientdProcess.removeAllListeners('exit')
	window.sentientdProcess.removeAllListeners('close')

	startUI('Welcome to Sentient', initUI)
}
