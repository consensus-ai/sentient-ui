import { Menu, BrowserWindow, Tray, app } from 'electron'
import appMenu from './appMenu.js'
import appTray from './trayMenu.js'
import Path from 'path'
import { version, releaseName } from '../../package.json'

require('electron-debug')();

// Save window position and bounds every time the window is moved or resized.
const onBoundsChange = (mainWindow, config) => () => {
	const bounds = mainWindow.getBounds()
	for (const b in bounds) {
		config.attr(b, bounds[b])
	}
}

// Main process logic partitioned to other files
// Creates the window and loads index.html
export default function(config) {
	// Create the browser
	const iconPath = Path.join(__dirname, '../', 'assets', 'icon.png')
	const mainWindow = new BrowserWindow({
		icon:   iconPath,
		title:  'Sentient Hub',
		webPreferences: {
			nodeIntegration: true,
		},
	})
	// Set mainWindow's closeToTray flag from config.
	// This should be used in the renderer to cancel close() events using window.onbeforeunload
	mainWindow.closeToTray = config.closeToTray

	if (process.platform === 'darwin') {
		mainWindow.tray = new Tray(Path.join(app.getAppPath(), 'assets', 'tray@2x.png'))
	} else {
		mainWindow.tray = new Tray(Path.join(app.getAppPath(), 'assets', 'tray.png'))
	}
	mainWindow.tray.setToolTip('Sentient')
	mainWindow.tray.setContextMenu(appTray(mainWindow))

	// Load the window's size and position
	mainWindow.setBounds(config)
	mainWindow.on('move', onBoundsChange(mainWindow, config))
	mainWindow.on('resize', onBoundsChange(mainWindow, config))

	// Load the index.html of the app.
	mainWindow.loadURL(Path.join('file://', app.getAppPath(), 'index.html'))
	// Choose not to show the menubar
	if (process.platform !== 'darwin') {
		mainWindow.setMenuBarVisibility(false)
	} else {
		// Create the Application's main menu - OSX version might feel weird without a menubar
		Menu.setApplicationMenu(appMenu(mainWindow))

		// Set the about panel's properties
		app.setAboutPanelOptions({
			applicationName: 'Sentient Hub',
			applicationVersion: version,
			copyright: 'Consensus Foundation.',
			version: releaseName,
		})
	}
	return mainWindow
}
