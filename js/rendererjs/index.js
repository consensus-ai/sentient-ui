// Imported Electron modules
import Path from 'path'
import * as Sentientd from 'sentient.js'
import loadingScreen from './loadingScreen.js'
import { remote, ipcRenderer } from 'electron'
import find from 'find-process'
import { unloadPlugins, loadPlugin, setCurrentPlugin, getOrderedPlugins, getPluginName } from './plugins.js'

const App = remote.app
const mainWindow = remote.getCurrentWindow()
const defaultPluginDirectory = Path.join(App.getAppPath(), './plugins')
const defaultHomePlugin = 'Wallet'
const config = remote.getGlobal('config')
window.closeToTray = mainWindow.closeToTray

// Called at window.onload by the loading screen.
// Wait for sentientd to load, then load the plugin system.
function init(callback) {
	// Initialize plugins.
	const plugins = getOrderedPlugins(defaultPluginDirectory, defaultHomePlugin)
	let homePluginView
	// Load each plugin element into the UI
	for (let i = 0; i < plugins.size; i++) {
		const plugin = (() => {
			if (getPluginName(plugins.get(i)) === 'Logs') {
				return loadPlugin(plugins.get(i), true, 'Ctrl+Shift+L')
			}
			return loadPlugin(plugins.get(i))
		})()

		if (getPluginName(plugins.get(i)) === defaultHomePlugin) {
			homePluginView = plugin
		}
	}
	const onHomeLoad = () => {
		setCurrentPlugin(defaultHomePlugin)
		homePluginView.removeEventListener('dom-ready', onHomeLoad)
		callback()
	}
	// wait for the home plugin to load before calling back
	homePluginView.addEventListener('dom-ready', onHomeLoad)
}

// shutdown triggers a clean shutdown of sentientd.
const shutdown = async () => {
	unloadPlugins()

	const overlay = document.getElementsByClassName('overlay')[0]
	const overlayText = overlay.getElementsByClassName('centered')[0].getElementsByTagName('p')[0]
	const sentientdConfig = config.attr('sentientd')

	overlay.style.display = 'inline-flex'
	overlayText.textContent = 'Quitting Sentient...'

	// Block, displaying Quitting Sentient..., until Sentientd has stopped.
	if (typeof window.sentientdProcess !== 'undefined') {
		setTimeout(() => window.sentientdProcess.kill('SIGKILL'), 15000)
		Sentientd.call(sentientdConfig.address, '/daemon/stop')
		const running = (pid) => {
			try {
				process.kill(pid, 0)
				return true
			} catch (e) {
				return false
			}
		}
		const sleep = (ms = 0) => new Promise((r) => setTimeout(r, ms))
		while (running(window.sentientdProcess.pid)) {
			await sleep(200)
		}
	}
	// Kill all miner process on exit app
	let processName = (process.platform === 'win32' ? 'sentient-miner.exe' : 'sentient-miner')
	await find('name', processName, true).then((list) => {
		list.forEach((minerProcess) => { process.kill(minerProcess.pid) })
	})

	mainWindow.destroy()
}

// Register an IPC callback for triggering clean shutdown
ipcRenderer.on('quit', async () => {
	await shutdown()
})

// If closeToTray is set, hide the window and cancel the close.
// On windows, display a balloon notification on first hide
// to inform users that Sentient-UI is still running.  NOTE: returning any value
// other than `undefined` cancels the close.
let hasClosed = false
window.onbeforeunload = () => {
	if (window.closeToTray) {
		if (mainWindow.isVisible() === false) {
			mainWindow.restore()
			shutdown()
			return false
		}

		if (process.platform === 'linux') {
			// minimize is not supported in all linux WM/DEs, so we hide instead
			mainWindow.hide()
		} else {
			// minimize is supported by both windows and MacOS.
			mainWindow.minimize()
		}

		if (process.platform === 'win32' && !hasClosed) {
			mainWindow.tray.displayBalloon({
				title: 'Sentient-UI information',
				content: 'Sentient is still running.  Right click this tray icon to quit or restore Sentient.',
			})
			hasClosed = true
		}
		return false
	}
	shutdown()
	return false
}

// Once the main window loads, start the loading process.
window.onload = function() {
	loadingScreen(init)
}

