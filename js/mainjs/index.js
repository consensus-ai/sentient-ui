import { app } from 'electron'
import Path from 'path'
import loadConfig from './config.js'
import initWindow from './initWindow.js'
import { v4 as uuid } from 'uuid'
import Analytics from 'electron-google-analytics'
import os from 'os'
import { version } from '../../package.json'

// load config.json manager
const basePath = process.env.SENTIENTD_DATA_DIR || app.getPath('userData')
global.config = loadConfig(Path.join(basePath, 'config.json'))
let mainWindow

// initialize GA objects
const analytics = new Analytics('UA-131311702-2')

// create uniq user id
if (!config.userid) {
	config.userid = uuid()
}

analytics.set('uid', config.userid)
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
	// Send GA on open APP
	analytics.event('App', 'open', { clientID: config.userid })
	analytics.event('Platform', os.platform(), { clientID: config.userid })
	analytics.event('Version', version, { clientID: config.userid })
	// Load mainWindow
	mainWindow = initWindow(config)
})

// Quit once all windows have been closed.
app.on('window-all-closed', () => {
	analytics.event('App', 'close', { clientID: config.userid }).then(() => {
		app.quit()
	})
})

// On quit, save the config.  There's no need to call sentientd.stop here, since if
// sentientd was launched by the UI, it will be a descendant of the UI in the
// process tree and will therefore be killed.
app.on('quit', () => {
	config.save()
})
