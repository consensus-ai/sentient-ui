import fs from 'graceful-fs'
import Path from 'path'
import { app } from 'electron'
import { version } from '../../package.json'
import semver from 'semver'

const defaultSentientdPath = Path.join(__dirname, '../sentient-network', (process.platform === 'win32' ? 'sentientd.exe' : 'sentientd'))
const defaultGenesisFile = Path.join(__dirname, '../sentient-network', 'config', 'genesis.json')
const defaultDataDir = Path.join(app.getPath('userData'), 'data')

// The default settings
const defaultConfig = {
	sentientd: {
		path: process.env.SENTIENTD_PATH || defaultSentientdPath,
		datadir: process.env.SENTIENTD_DATA_DIR || defaultDataDir,
		genesisfile: process.env.SENTIENTD_GENESIS_FILE || defaultGenesisFile,
		address: process.env.SENTIENTD_API_ADDR || '127.0.0.1:9910',
		rpcaddr: process.env.SENTIENTD_RPC_ADDR || ':9911',
		detached: false,
	},
	closeToTray: false,
	width:	   1024,
	height:	  768,
	x:		   0,
	y:		   0,
	version: version,
}

/**
 * Holds all config.json related logic
 * @module configManager
 */
export default function configManager(filepath) {
	let config

	try {
		const data = fs.readFileSync(filepath)
		config = JSON.parse(data)
	} catch (err) {
		config = defaultConfig
	}

	// always use the default sentientd path after an upgrade
	if (typeof config.version === 'undefined') {
		config.version = version
		config.sentientd.path = defaultSentientdPath
	} else if (semver.lt(config.version, version)) {
		config.version = version
		config.sentientd.path = defaultSentientdPath
	}

	// fill out default values if config is incomplete
	config = Object.assign(defaultConfig, config)

	/**
	 * Gets or sets a config attribute
	 * @param {object} key - key to get or set
	 * @param {object} value - value to set config[key] as
	 */
	config.attr = function(key, value) {
		if (value !== undefined) {
			config[key] = value
		}
		if (config[key] === undefined) {
			config[key] = null
		}
		return config[key]
	}

	/**
	 * Writes the current config to defaultConfigPath
	 * @param {string} path - UI's defaultConfigPath
	 */
	config.save = function() {
		fs.writeFileSync(filepath, JSON.stringify(config, null, '\t'))
	}

	/**
	 * Sets config to what it was on disk
	 */
	config.reset = function() {
		config = configManager(filepath)
	}

	// expose the default sentientd path
	config.defaultSentientdPath = defaultSentientdPath
	config.defaultGenesisFile = defaultGenesisFile

	// Save to disk immediately when loaded
	try {
		config.save()
	} catch (err) {
		console.error('couldnt save config.json: ' + err.toString())
	}

	// Return the config object with the above 3 member functions
	return config
}

