// This module handles the construction of Sentient-UI plugins.
import { List } from 'immutable'
import Path from 'path'
import { remote } from 'electron'
const analytics = remote.getGlobal('analytics')

const devtoolsShortcut = 'Ctrl+Shift+P'

// Create an icon element for a plugin button.
const createButtonIconElement = (path) => {
	const i = document.createElement('img')
	i.src = path
	i.className = 'pure-u icon'
	return i
}

// Create a text element for a plugin button.
const createButtonTextElement = (name) => {
	const t = document.createElement('div')
	t.innerText = name
	t.className = 'pure-u text'
	return t
}

// Construct a plugin view element from a plugin path and title
const createPluginElement = (markupPath, title) => {
	const elem = document.createElement('webview')
	elem.id = title + '-view'
	elem.className = 'webview'
	elem.src = markupPath
	// This is enabled for legacy plugin support.
	elem.nodeintegration = true
	return elem
}

// registerLocalShortcut registers an electron globalShortcut that is only
// active when the app has focus.
const registerLocalShortcut = (shortcut, action) => {
	remote.app.on('browser-window-blur', () => {
		remote.globalShortcut.unregister(shortcut)
	})
	remote.app.on('browser-window-focus', () => {
		remote.globalShortcut.register(shortcut, action)
	})
	remote.globalShortcut.register(shortcut, action)
}

// Set a plugin as the visible plugin
export const setCurrentPlugin = (pluginName) => {
	const currentElements = document.querySelectorAll('.current')
	for (const elem in currentElements) {
		if (typeof currentElements[elem].classList !== 'undefined') {
			currentElements[elem].classList.remove('current')
		}
	}
	const viewElem = document.getElementById(pluginName + '-view')
	if (viewElem !== null) {
		viewElem.classList.add('current')
	}
	viewElem.focus()

	const buttonElem = document.getElementById(pluginName + '-button')
	if (buttonElem !== null) {
		buttonElem.classList.add('current')
	}
	remote.globalShortcut.unregister(devtoolsShortcut)
	remote.app.removeAllListeners('browser-window-blur')
	remote.app.removeAllListeners('browser-window-focus')
	registerLocalShortcut(devtoolsShortcut, () => {
		viewElem.openDevTools()
	})
}

// Construct a plugin button element from an icon path and title
const hookUpPluginButton = (title) => {
	const elem = document.getElementById(title+'-button')
	elem.onclick = () => {
		analytics.pageview(`/${title.toLowerCase()}`, "http://sentient-ui.consensus.ai", title).send()
		setCurrentPlugin(title)
	}
	return elem
}

// Get the name of a plugin from its path.
export const getPluginName = (pluginPath) => Path.basename(pluginPath)

// loadPlugin constructs plugin view and plugin button elements
// and adds these elements to the main UI's mainbar/sidebar.
// Returns the plugin's main view element.
export const loadPlugin = (pluginPath, hidden = false, shortcut) => {
	const name = getPluginName(pluginPath)
	const markupPath = Path.join(pluginPath, 'index.html')

	const viewElement = createPluginElement(markupPath, name)
	const buttonElement = hookUpPluginButton(name)

	if (typeof shortcut !== 'undefined') {
		registerLocalShortcut(shortcut, () => {
			setCurrentPlugin(name)
		})
	}
	if (!hidden) {
		document.getElementById('sidebar').appendChild(buttonElement)
	}
	document.getElementById('mainbar').appendChild(viewElement)

	return viewElement
}

// unloadPlugins removes the mainbar and the sidebar from the document.
export const unloadPlugins = () => {
	const mainbar = document.getElementById('mainbar')
	const sidebar = document.getElementById('sidebar')
	mainbar.parentNode.removeChild(mainbar)
	sidebar.parentNode.removeChild(sidebar)
}

// Scan a folder at path and return an ordered list of plugins.
// The plugin specified by `homePlugin` is always moved to the top of the list,
// if it exists.
export const getOrderedPlugins = (path, homePlugin) => {
	return List([
		Path.join(path,"Wallet"),
		Path.join(path,"Miner"),
		Path.join(path, "About")
	])
}

