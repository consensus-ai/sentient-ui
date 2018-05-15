import { Application } from 'spectron'
import { spawn } from 'child_process'
import { expect } from 'chai'
import psTree from 'ps-tree'
import * as Sentientd from 'sentient.js'
import fs from 'fs'
import senConfig from '../js/mainjs/config.js'

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// getSentientdChild takes an input pid and looks at all the child process of that
// pid, returning an object with the fields {exists, pid}, where exists is true
// if the input pid has a 'sentientd' child, and the pid is the process id of the
// child.
const getSentientdChild = (pid) => new Promise((resolve, reject) => {
	psTree(pid, (err, children) => {
		if (err) {
			reject(err)
		}
		children.forEach((child) => {
			if (child.COMM.endsWith('sentientd') || child.COMM.endsWith('sentientd.exe')) {
				resolve({exists: true, pid: child.PID})
			}
		})
		resolve({exists: false})
	})
})

// pkillSentientd kills all sentientd processes running on the machine, used in these
// tests to ensure a clean env
const pkillSentientd = () => new Promise((resolve, reject) => {
	psTree(process.pid, (err, children) => {
		if (err) {
			reject(err)
		}
		children.forEach((child) => {
			if (child.COMM.endsWith('sentientd') || child.COMM.endsWith('sentientd.exe')) {
				if (process.platform === 'win32') {
					spawn('taskkill', ['/pid', child.PID, '/f', '/t'])
				} else {
					process.kill(child.PID, 'SIGKILL')
				}
			}
		})
		resolve()
	})
})

// isProcessRunning leverages the semantics of `process.kill` to return true if
// the input pid is a running process.  If process.kill is initiated with the
// signal set to '0', no signal is sent, but error checking is still performed.
const isProcessRunning = (pid) => {
	try {
		process.kill(pid, 0)
		return true
	} catch (e) {
		return false
	}
}

let electronBinary
if (process.platform === 'win32') {
	electronBinary = 'node_modules\\electron\\dist\\electron.exe'
} else if (process.platform === 'darwin') {
	electronBinary = './node_modules/electron/dist/Electron.app/Contents/MacOS/Electron'
} else {
	electronBinary = './node_modules/electron/dist/electron'
}

// we need functions for mocha's `this` for setting timeouts.
/* eslint-disable no-invalid-this */
/* eslint-disable no-unused-expressions */
describe('startup and shutdown behaviour', () => {
	after(async () => {
		// never leave a dangling sentientd
		await pkillSentientd()
	})
	describe('window closing behaviour', function() {
		this.timeout(200000)
		let app
		let sentientdProcess
		beforeEach(async () => {
			app = new Application({
				path: electronBinary,
				args: [
					'.',
				],
			})
			await app.start()
			await app.client.waitUntilWindowLoaded()
			while (await app.client.isVisible('#overlay-text') === true) {
				await sleep(10)
			}
		})
		afterEach(async () => {
			try {
				await pkillSentientd()
				while (isProcessRunning(sentientdProcess.pid)) {
					await sleep(10)
				}
				app.webContents.send('quit')
				await app.stop()

			} catch (e) {
			}
		})
		it('hides the window and persists in tray if closeToTray = true', async () => {
			const pid = await app.mainProcess.pid()
			sentientdProcess = await getSentientdChild(pid)
			app.webContents.executeJavaScript('window.closeToTray = true')
			app.browserWindow.close()
			await sleep(1000)
			expect(await app.browserWindow.isDestroyed()).to.be.false
			expect(await app.browserWindow.isVisible()).to.be.false
			expect(isProcessRunning(sentientdProcess.pid)).to.be.true
		})
		it('quits gracefully on close if closeToTray = false', async () => {
			app.webContents.executeJavaScript('window.closeToTray = false')
			const pid = await app.mainProcess.pid()
			expect(sentientdProcess.exists).to.be.true

			app.browserWindow.close()
			while (isProcessRunning(pid)) {
				await sleep(10)
			}
			expect(isProcessRunning(sentientdProcess.pid)).to.be.false
		})
		it('quits gracefully on close if already minimized and closed again', async () => {
			const pid = await app.mainProcess.pid()
			sentientdProcess = await getSentientdChild(pid)
			app.webContents.executeJavaScript('window.closeToTray = true')
			app.browserWindow.close()
			await sleep(1000)
			expect(await app.browserWindow.isDestroyed()).to.be.false
			expect(await app.browserWindow.isVisible()).to.be.false
			expect(isProcessRunning(sentientdProcess.pid)).to.be.true
			app.browserWindow.close()
			while (isProcessRunning(pid)) {
				await sleep(10)
			}
			expect(isProcessRunning(sentientdProcess.pid)).to.be.false
		})
	})
	describe('startup with no sentientd currently running', function() {
		this.timeout(120000)
		let app
		let sentientdProcess
		before(async () => {
			app = new Application({
				path: electronBinary,
				args: [
					'.',
				],
			})
			await app.start()
			await app.client.waitUntilWindowLoaded()
			while (await app.client.isVisible('#overlay-text') === true) {
				await sleep(10)
			}
		})
		after(async () => {
			await pkillSentientd()
			while (isProcessRunning(sentientdProcess.pid)) {
				await sleep(10)
			}
			if (app.isRunning()) {
				app.webContents.send('quit')
				app.stop()
			}
		})
		it('starts sentientd and loads correctly on launch', async () => {
			const pid = await app.mainProcess.pid()
			await app.client.waitUntilWindowLoaded()
			sentientdProcess = await getSentientdChild(pid)
			expect(sentientdProcess.exists).to.be.true
		})
		it('gracefully exits sentientd on quit', async () => {
			const pid = await app.mainProcess.pid()
			app.webContents.send('quit')
			while (await app.client.isVisible('#overlay-text') === false) {
				await sleep(10)
			}
			while (await app.client.getText('#overlay-text') !== 'Quitting Sentient...') {
				await sleep(10)
			}
			while (isProcessRunning(pid)) {
				await sleep(10)
			}
			expect(isProcessRunning(sentientdProcess.pid)).to.be.false
		})
	})
	describe('startup with a sentientd already running', function() {
		this.timeout(120000)
		let app
		let sentientdProcess
		let sentientdConfig
		before(async () => {
			if (!fs.existsSync('sen-testing')) {
				fs.mkdirSync('sen-testing')
			}
			sentientdConfig = senConfig('sen-testing/config.json').sentientd
			sentientdProcess = Sentientd.launch(sentientdConfig.path, {
				'sen-directory': 'sen-testing',
				'rpc-addr': sentientdConfig.rpcaddr,
				'api-addr': sentientdConfig.address,
				'genesis-file': sentientdConfig.genesisfile,
				'modules': 'gctmw',
			})
			while (await Sentientd.isRunning(sentientdConfig.address) === false) {
				await sleep(10)
			}
			app = new Application({
				path: electronBinary,
				args: [
					'.',
				],
			})
			await app.start()
			await app.client.waitUntilWindowLoaded()
			while (await app.client.isVisible('#overlay-text') === true) {
				await sleep(10)
			}
		})
		after(async () => {
			await pkillSentientd()
			if (app.isRunning()) {
				app.webContents.send('quit')
				app.stop()
			}
			while (isProcessRunning(sentientdProcess.pid)) {
				await sleep(10)
			}
		})
		it('connects and loads correctly to the running sentientd', async () => {
			const pid = await app.mainProcess.pid()
			await app.client.waitUntilWindowLoaded()
			const childSentientd = await getSentientdChild(pid)
			expect(childSentientd.exists).to.be.false
		})
		it('doesnt quit sentientd on exit', async () => {
			const pid = await app.mainProcess.pid()
			app.webContents.send('quit')
			while (isProcessRunning(pid)) {
				await sleep(200)
			}
			expect(isProcessRunning(sentientdProcess.pid)).to.be.true
			sentientdProcess.kill('SIGKILL')
		})
	})
})

/* eslint-enable no-invalid-this */
/* eslint-enable no-unused-expressions */
