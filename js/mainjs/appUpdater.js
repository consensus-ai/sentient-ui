import { app, dialog } from 'electron'
import { autoUpdater } from "electron-updater"
import Path from 'path'
const iconPath = Path.join(__dirname, '../', 'assets', 'icon.png')
import request from 'request'

export default function () {
    autoUpdater.on('error', (err) => {
		dialog.showMessageBox({
			type: 'info',
			defaultId: 0,
			icon: iconPath,
			message: 'Error during update',
			detail: err.toString()
		})
	})
	autoUpdater.on('checking-for-update', () => {
		dialog.showMessageBox({
			type: 'info',
			defaultId: 0,
			icon: iconPath,
			message: 'Error during update',
			detail: 'checking-for-update'
		})
	})
	autoUpdater.on('update-available', () => {
		dialog.showMessageBox({
			type: 'info',
			defaultId: 0,
			icon: iconPath,
			message: 'Error during update',
			detail: 'update-available'
		})
	})
	autoUpdater.on('update-not-available', () => {
		dialog.showMessageBox({
			type: 'info',
			defaultId: 0,
			icon: iconPath,
			message: 'Error during update',
			detail: 'update-available'
		})
	})

	autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
		let message = 'A new version of Sentient UI is now available. It will be installed the next time you restart the application.'
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
					message: 'A new version of Sentient UI has been downloaded',
					detail: message
				}, response => {
					if (response === 0) {
						setTimeout(() => autoUpdater.quitAndInstall(), 1)
					}
				})
		})
	});
	// init for updates
	autoUpdater.checkForUpdates();
}
