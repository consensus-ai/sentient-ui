import { Menu } from 'electron'

export default function(window) {
	// Template for Sentient-UI tray menu.
	const menutemplate = [
		{
			label: 'Show Sentient',
			click: () => window.show(),
		},
		{ type: 'separator' },
		{
			label: 'Hide Sentient',
			click: () => window.hide(),
		},
		{ type: 'separator' },
		{
			label: 'Quit Sentient',
			click: () => {
				window.webContents.send('quit')
			},
		},
	]

	return Menu.buildFromTemplate(menutemplate)
}
