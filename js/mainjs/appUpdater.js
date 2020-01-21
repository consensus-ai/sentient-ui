import { dialog } from 'electron'
import { autoUpdater } from "electron-updater"
import Path from 'path'
const iconPath = Path.join(__dirname, '../', 'assets', 'icon.png')
import request from 'request'

const CHECK_INTERVAL = 7200000

export default function () {
	autoUpdater.on('error', (err) => {
		let message = err.toString()
		if (/ERR_INTERNET_DISCONNECTED/.test(message)){
			message = "Sentient Hub currently is unable to connect to the update server. Please check your connection settings or try checking for an update later"
		}
		dialog.showMessageBox({
			type: 'error',
			defaultId: 0,
			icon: iconPath,
			message: 'Error during update',
			detail: message
		})
	})

	autoUpdater.on('update-not-available', () => {
		setTimeout(() => autoUpdater.checkForUpdates(), CHECK_INTERVAL)
	})

	autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
		let message = 'A new version of Sentient Hub is now available. It will be installed the next time you restart the application.'
		request('https://api.github.com/repos/consensus-ai/sentient-ui/releases/latest', 
			{ headers: { 'User-Agent': ' Sentient-UI' },  json: true }, (err, res, { body }) => {
				if (body) {
					message += '\n\n'
					const splitNotes = body.split(/[^\r]\n/)
					splitNotes.forEach(notes => {
						message += notes + '\n\n'
					})
				}
				dialog.showMessageBox({
					type: 'question',
					buttons: ['Install and Relaunch', 'Later'],
					defaultId: 0,
					icon: iconPath,
					message: 'A new version of Sentient Hub has been downloaded',
					detail: message
				}, response => {
					if (response === 0) {
						setTimeout(() => autoUpdater.quitAndInstall(), 1)
					}
				})
		})
	})
	// init for updates
	autoUpdater.checkForUpdates()
}
