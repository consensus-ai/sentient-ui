/* eslint-disable no-unused-expressions */
/* eslint-disable no-invalid-this */
import createSagaMiddleware from 'redux-saga'
import { createStore, applyMiddleware } from 'redux'
import * as actions from '../../plugins/Files/js/actions/files.js'
import * as sagas from '../../plugins/Files/js/sagas/files.js'
import { expect } from 'chai'
import { spy } from 'sinon'
import proxyquire from 'proxyquire'
import { List } from 'immutable'
import * as Sentientd from 'sentient.js'
import rootReducer from '../../plugins/Files/js/reducers/index.js'
const sagaMiddleware = createSagaMiddleware()

// Stub out the helper functions used in the files sagas.
let testAvailableStorage
let testUsage
let testCost
let testUploads
let testDownloads
let testDirectoryFiles
const helperMocks = {
	'./helpers.js': {
		allowanceStorage: () => testAvailableStorage,
		totalUsage: () => testUsage,
		estimatedStoragePriceGBSC: () => testCost,
		parseUploads: () => testUploads,
		parseDownloads: () => testDownloads,
		readdirRecursive: () => testDirectoryFiles,
		'@global': true,
	},
}

const rootSaga = proxyquire('../../plugins/Files/js/sagas/index.js', helperMocks).default
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// Stub the parts of the Sentient API that the files plugin uses.
const contracts = []
let testFiles
let walletState
const uploadSpy = spy()
const setAllowanceSpy = spy()
const downloadSpy = spy()
const deleteSpy = spy()
const renameSpy = spy()
const testFunds = Sentientd.senToHastings(100000)
const mockSentientAPI = {
	call: (uri, callback) => {
		if (uri === '/renter/contracts') {
			callback(null, { contracts })
		}
		if (uri === '/renter/files') {
			callback(null, { files: testFiles })
		}
		if (uri === '/wallet') {
			callback(null, walletState)
		}
		if (uri === '/hostdb/active') {
			callback(null, {
				hosts: [],
			})
		}
		if (uri === '/renter/downloads') {
			callback(null, {
				downloads: testDownloads,
			})
		}
		if (uri === '/renter') {
			callback(null, {
				settings: {
					allowance: {
						funds: testFunds.toString(),
					},
				},
			})
		}

		if (typeof uri === 'object') {
			if (uri.url.indexOf('/renter/delete') !== -1) {
				deleteSpy(uri.url)
				callback()
			}
			if (uri.url.indexOf('/renter/download') !== -1) {
				downloadSpy(uri.url, uri.qs.destination)
				callback()
			}
			if (uri.url.indexOf('/renter/upload') !== -1) {
				uploadSpy(uri.url)
				callback()
			}
			if (uri.url.indexOf('/renter/rename') !== -1) {
				renameSpy(uri.url, uri.qs.newsenpath)
				callback()
			}
			if (uri.url === '/renter') {
				setAllowanceSpy(uri.qs.funds, uri.qs.hosts, uri.qs.period)
				callback()
			}
		}
	},
	showError: spy(),
	senToHastings: Sentientd.senToHastings,
	hastingsToSen: Sentientd.hastingsToSen,
}

let store

describe('files plugin sagas', () => {
	before(() => {
		global.SentientAPI = mockSentientAPI
		store = createStore(
			rootReducer,
			applyMiddleware(sagaMiddleware)
		)
		sagaMiddleware.run(rootSaga)
	})
	afterEach(() => {
		SentientAPI.showError.reset()
	})
	it('runs every watcher saga defined in files', () => {
		expect(rootSaga().next().value).to.have.length(Object.keys(sagas).length)
	})
	it('sets contract count on getContractCount', async () => {
		const contractCount = 36
		for (let i = 0; i < contractCount; i++) {
			contracts.push('test' + i)
		}
		store.dispatch(actions.getContractCount())
		await sleep(10)
		expect(store.getState().files.get('contractCount')).to.equal(contracts.length)
		expect(SentientAPI.showError.called).to.be.false
	})
	it('sets files on getFiles', async () => {
		testFiles = [
			{ senpath: 'testfile', available: true, redundancy: 6 },
			{ senpath: 'testfile2', available: true, redundancy: 6 },
			{ senpath: 'testfile3', available: true, redundancy: 6 },
			{ senpath: 'testfile4', available: true, redundancy: 6 },
		]
		store.dispatch(actions.getFiles())
		await sleep(500)
		expect(store.getState().files.get('files').size).to.equal(testFiles.length)
		expect(SentientAPI.showError.called).to.be.false
	})
	it('sets wallet lock state on getWalletLockstate', async () => {
		walletState = {
			unlocked: false,
			encrypted: true,
			confirmedsenbalance: Sentientd.senToHastings(1000).toString(),
		}
		store.dispatch(actions.getWalletLockstate())
		await sleep(10)
		expect(store.getState().wallet.get('unlocked')).to.be.false
		walletState.unlocked = true
		store.dispatch(actions.getWalletLockstate())
		await sleep(10)
		expect(store.getState().wallet.get('unlocked')).to.be.true
		expect(SentientAPI.showError.called).to.be.false
	})
	it('calls /renter/upload on uploadFile', async () => {
		uploadSpy.reset()
		store.dispatch(actions.uploadFile('testfile', ''))
		await sleep(10)
		expect(uploadSpy.calledWithExactly('/renter/upload/testfile')).to.be.true
		expect(SentientAPI.showError.called).to.be.false
	})
	it('calls /renter/upload correctly on every file in a folder on uploadFolder', async () => {
		uploadSpy.reset()
		testDirectoryFiles = List([
			'/test/testdir/testfile5',
			'/test/testdir/testfile6',
			'/test/testdir/testfolder/testfile2.jpg',
			'/test/testdir/testfolder/testfolder2/testfolder.png',
			'/test/testdir/testfile.app.png',
		])
		store.dispatch(actions.uploadFolder('test/testsenpath', '/test/testdir'))
		await sleep(10)
		expect(SentientAPI.showError.called).to.be.false
		expect(uploadSpy.callCount).to.equal(testDirectoryFiles.size)
		expect(uploadSpy.calledWithExactly('/renter/upload/test/testsenpath/testdir/testfile5')).to.be.true
		expect(uploadSpy.calledWithExactly('/renter/upload/test/testsenpath/testdir/testfile6')).to.be.true
		expect(uploadSpy.calledWithExactly('/renter/upload/test/testsenpath/testdir/testfolder/testfile2.jpg')).to.be.true
		expect(uploadSpy.calledWithExactly('/renter/upload/test/testsenpath/testdir/testfolder/testfolder2/testfolder.png')).to.be.true
		expect(uploadSpy.calledWithExactly('/renter/upload/test/testsenpath/testdir/testfile.app.png')).to.be.true
	})
	it('sets uploads on getUploads', async () => {
		testUploads = List([
			{senpath: 'upload1'},
			{senpath: 'upload2'},
			{senpath: 'upload3'},
		])
		store.dispatch(actions.getUploads())
		await sleep(10)
		expect(store.getState().files.get('uploading')).to.deep.equal(testUploads)
		expect(SentientAPI.showError.called).to.be.false
	})
	it('sets downloads on getDownloads', async () => {
		testDownloads = List([
			{ senpath: 'upload4', name: 'upload4', starttime: new Date() },
			{ senpath: 'upload5', name: 'upload5', starttime: new Date() },
			{ senpath: 'upload6', name: 'upload6', starttime: new Date() },
		])
		store.dispatch(actions.getDownloads())
		await sleep(10)
		expect(store.getState().files.get('downloading').toObject()).to.deep.equal(testDownloads.toObject())
		expect(SentientAPI.showError.called).to.be.false
	})
	const testFile = {
		senpath: 'test/senpath',
		type: 'file',
	}
	it('can buffer lots of delete actions', function() {
		this.timeout(40000)
		for (let i = 0; i < 4096; i++) {
			store.dispatch(actions.deleteFile(testFile))
		}
		expect(SentientAPI.showError.called).to.be.false
	})
	it('can buffer lots of upload actions', function() {
		this.timeout(40000)
		for (let i = 0; i < 4096; i++) {
			store.dispatch(actions.uploadFile('testfile', ''))
		}
		expect(SentientAPI.showError.called).to.be.false
	})
	it('can buffer lots of download actions', function() {
		this.timeout(20000)
		for (let i = 0; i < 4096; i++) {
			store.dispatch(actions.downloadFile('testfile', ''))
		}
		expect(SentientAPI.showError.called).to.be.false
	})
	it('calls /renter/download on downloadFile', async () => {
		store.dispatch(actions.downloadFile(testFile, '/test/downloadpath'))
		await sleep(10)
		expect(downloadSpy.calledWithExactly('/renter/download/test/senpath', '/test/downloadpath')).to.be.true
		expect(SentientAPI.showError.called).to.be.false
	})
	describe('deletion sagas', () => {
		it('calls /renter/delete on deleteFile', async () => {
			store.dispatch(actions.deleteFile(testFile))
			await sleep(10)
			expect(deleteSpy.calledWithExactly('/renter/delete/test/senpath')).to.be.true
			expect(SentientAPI.showError.called).to.be.false
		})
		it('calls /renter/delete for every file in a directory and subdirectories', async () => {
			testFiles = [
				{ senpath: 'testfile', available: true, redundancy: 6 },
				{ senpath: 'testfile2', available: true, redundancy: 6 },
				{ senpath: 'testfile3', available: true, redundancy: 6 },
				{ senpath: 'testfile4', available: true, redundancy: 6 },
				{ senpath: 'testdir/testfile', available: true, redundancy: 6 },
				{ senpath: 'testdir/testfile2', available: true, redundancy: 6 },
				{ senpath: 'testdir/testdir2/testfile2', available: true, redundancy: 6 },
				{ senpath: 'testdir/testdir2/testdir3/testfile2', available: true, redundancy: 6 },
			]
			store.dispatch(actions.getFiles())
			await sleep(10)
			store.dispatch(actions.deleteFile({ type: 'directory', senpath: 'testdir' }))
			await sleep(10)
			expect(deleteSpy.calledWith('/renter/delete/testdir/testfile')).to.be.true
			expect(deleteSpy.calledWith('/renter/delete/testdir/testfile2')).to.be.true
			expect(deleteSpy.calledWith('/renter/delete/testdir/testdir2/testfile2')).to.be.true
			expect(deleteSpy.calledWith('/renter/delete/testdir/testdir2/testdir3/testfile2')).to.be.true
		})
	})
	it('sets allowance with the correct allowance on setAllowance', async () => {
		const allowance = '10000' // SC
		store.dispatch(actions.setAllowance(allowance))
		await sleep(10)
		expect(store.getState().files.get('showAllowanceDialog')).to.be.false
		expect(store.getState().files.get('settingAllowance')).to.be.false
		expect(SentientAPI.showError.called).to.be.false
	})
	it('sets the correct wallet balance on getWalletBalance', async () => {
		store.dispatch(actions.getWalletBalance())
		await sleep(10)
		expect(store.getState().wallet.get('balance')).to.equal(Sentientd.hastingsToSen(walletState.confirmedsenbalance).round(2).toString())
		expect(SentientAPI.showError.called).to.be.false
	})
	it('calls /renter/rename on renameFile', async () => {
		store.dispatch(actions.renameFile(testFile, 'test/newsenpath'))
		await sleep(10)
		expect(renameSpy.calledWithExactly('/renter/rename/test/senpath', 'test/newsenpath')).to.be.true
		expect(SentientAPI.showError.called).to.be.false
	})
})
/* eslint-enable no-unused-expressions */
/* eslint-disable no-invalid-this */
