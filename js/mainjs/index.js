import { app } from 'electron'
import Path from 'path'
import loadConfig from './config.js'
import initWindow from './initWindow.js'
import appUpdater from './appUpdater.js'
import { v4 as uuid } from 'uuid'
import ua from 'universal-analytics'
import os from 'os'
import { version } from '../../package.json'

// load config.json manager
const basePath = process.env.SENTIENTD_DATA_DIR || app.getPath('userData')
global.config = loadConfig(Path.join(basePath, 'config.json'))
let mainWindow

// create uniq user id
if (!config.userid) {
	config.userid = uuid()
}
// initialize GA objects
const analytics = new ua('UA-131311702-2', config.userid)
global.analytics = analytics

// disable hardware accelerated rendering
app.disableHardwareAcceleration()

// Allow only one instance of Sentient-UI
const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
	app.quit()
} else {
	app.on('second-instance', () => {
		if (mainWindow) {
			if (mainWindow.isMinimized()) {
				mainWindow.restore()
			}
			mainWindow.focus()
		}
	})
}

// When Electron loading has finished, start Sentient-UI.
app.on('ready', () => {
	appUpdater()
	// Send GA on open APP
	analytics.pageview("/wallet", "http://sentient-ui.consensus.ai", "Wallet")
		.event('App', 'open')
		.event('Platform', os.platform())
		.event('Version', version)
		.send()
	// Load mainWindow
	mainWindow = initWindow(config)
})

// Quit once all windows have been closed.
app.on('window-all-closed', () => {
	analytics.event('App', 'close', () => {
		app.quit()
	})
})

// On quit, save the config.  There's no need to call sentientd.stop here, since if
// sentientd was launched by the UI, it will be a descendant of the UI in the
// process tree and will therefore be killed.
app.on('quit', () => {
	config.save()
})
