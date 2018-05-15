import { expect } from 'chai'
import { searchFiles, minRedundancy, minUpload, uploadDirectory, rangeSelect, readableFilesize, ls, buildTransferTimes, addTransferSpeeds } from '../../plugins/Files/js/sagas/helpers.js'
import { List, OrderedSet, Map } from 'immutable'
import proxyquire from 'proxyquire'
import Path from 'path'
import * as actions from '../../plugins/Files/js/actions/files.js'

describe('files plugin helper functions', () => {
	it('returns sane values from readableFilesize', () => {
		const sizes = {
			1 : '1 B',
			1000 : '1 KB',
			10000 : '10 KB',
			100000 : '100 KB',
			1000000 : '1 MB',
			10000000 : '10 MB',
			100000000 : '100 MB',
			1000000000 : '1 GB',
			10000000000 : '10 GB',
			100000000000 : '100 GB',
			1000000000000 : '1 TB',
			10000000000000 : '10 TB',
			100000000000000 : '100 TB',
			1000000000000000 : '1 PB',
		}
		for (const bytes in sizes) {
			expect(readableFilesize(parseFloat(bytes))).to.equal(sizes[bytes])
		}
	})
	describe('directory upload', () => {
		const uploadDirectoryWin32 = proxyquire('../../plugins/Files/js/sagas/helpers.js', {
			'path': Path.win32,
		}).uploadDirectory

		it('handles unix paths correctly', () => {
			const directoryTree = List([
				'/tmp/test/testfile.png',
				'/tmp/test/test_file.pdf',
				'/tmp/test/testdir/testfile.png',
				'/tmp/test/testdir/test.png',
			])
			expect(uploadDirectory('/tmp/test', directoryTree, 'testsenpath')).to.deep.equal(List([
				actions.uploadFile('testsenpath/test', '/tmp/test/testfile.png'),
				actions.uploadFile('testsenpath/test', '/tmp/test/test_file.pdf'),
				actions.uploadFile('testsenpath/test/testdir', '/tmp/test/testdir/testfile.png'),
				actions.uploadFile('testsenpath/test/testdir', '/tmp/test/testdir/test.png'),
			]))
		})
		it('handles windows paths correctly', () => {
			const directoryTree = List([
				'C:\\tmp\\test\\testfile.png',
				'C:\\tmp\\test\\test_file.pdf',
				'C:\\tmp\\test\\testdir\\testfile.png',
				'C:\\tmp\\test\\testdir\\test.png',
			])
			expect(uploadDirectoryWin32('C:\\tmp\\test', directoryTree, 'testsenpath')).to.deep.equal(List([
				actions.uploadFile('testsenpath/test', 'C:\\tmp\\test\\testfile.png'),
				actions.uploadFile('testsenpath/test', 'C:\\tmp\\test\\test_file.pdf'),
				actions.uploadFile('testsenpath/test/testdir', 'C:\\tmp\\test\\testdir\\testfile.png'),
				actions.uploadFile('testsenpath/test/testdir', 'C:\\tmp\\test\\testdir\\test.png'),
			]))
		})
	})
	describe('range selection', () => {
		const testFiles = List([
			{ senpath: 'test1' },
			{ senpath: 'test2' },
			{ senpath: 'test3' },
			{ senpath: 'test4' },
			{ senpath: 'test5' },
		])
		it('selects all from first -> last', () => {
			const selected = OrderedSet([
				{ senpath: 'test1' },
			])
			expect(rangeSelect(testFiles.last(), testFiles, selected).toArray()).to.deep.equal(testFiles.toArray())
		})
		it('selects all from last -> first', () => {
			const selected = OrderedSet([
				{ senpath: 'test5' },
			])
			expect(rangeSelect(testFiles.first(), testFiles, selected).toArray()).to.deep.equal(testFiles.reverse().toArray())
		})
		it('adds selections correctly top -> bottom', () => {
			const selected = OrderedSet([
				{ senpath: 'test2' },
			])
			const expectedSelection = [
				{ senpath: 'test2' },
				{ senpath: 'test3' },
			]
			expect(rangeSelect({ senpath: 'test3' }, testFiles, selected).toArray()).to.deep.equal(expectedSelection)
		})
		it('adds selections correctly bottom -> top', () => {
			const selected = OrderedSet([
				{ senpath: 'test4' },
			])
			const expectedSelection = [
				{ senpath: 'test4' },
				{ senpath: 'test3' },
				{ senpath: 'test2' },
			]
			expect(rangeSelect({ senpath: 'test2' }, testFiles, selected).toArray()).to.deep.equal(expectedSelection)
		})
		it('adds selections correctly given subsequent shift clicks top -> bottom', () => {
			let selected = OrderedSet([
				{ senpath: 'test1' },
			])
			let expectedSelection = [
				{ senpath: 'test1' },
				{ senpath: 'test2' },
				{ senpath: 'test3' },
			]
			expect(rangeSelect({ senpath: 'test3' }, testFiles, selected).toArray()).to.deep.equal(expectedSelection)
			selected = OrderedSet(expectedSelection)
			expectedSelection = [
				{ senpath: 'test1' },
				{ senpath: 'test2' },
			]
			expect(rangeSelect({ senpath: 'test2' }, testFiles, selected).toArray()).to.deep.equal(expectedSelection)
		})
		it('adds selections correctly given subsequent shift clicks bottom -> top', () => {
			let selected = OrderedSet([
				{ senpath: 'test5' },
			])
			let expectedSelection = [
				{ senpath: 'test5' },
				{ senpath: 'test4' },
				{ senpath: 'test3' },
			]
			expect(rangeSelect({ senpath: 'test3' }, testFiles, selected).toArray()).to.deep.equal(expectedSelection)
			selected = OrderedSet(expectedSelection)
			expectedSelection = [
				{ senpath: 'test5' },
				{ senpath: 'test4' },
			]
			expect(rangeSelect({ senpath: 'test4' }, testFiles, selected).toArray()).to.deep.equal(expectedSelection)
		})
	})
	describe('ls helper function', () => {
		const lsWin32 = proxyquire('../../plugins/Files/js/sagas/helpers.js', {
			'path': Path.win32,
		}).ls
		it('should ls a file list correctly', () => {
			const senpathInputs = List([
				{ filesize: 1337, senpath: 'folder/file.jpg', senUIFolder: false, redundancy: 2.0, available: true, uploadprogress: 50 },
				{ filesize: 13117, senpath: 'folder/file2.jpg', senUIFolder: false, redundancy: 2.0, available: true, uploadprogress: 100 },
				{ filesize: 1237, senpath: 'rare_pepe.png', senUIFolder: false, redundancy: 2.0, available: true, uploadprogress: 100 },
				{ filesize: 1317, senpath: 'memes/waddup.png', senUIFolder: false, redundancy: 2.5, available: true, uploadprogress: 10 },
				{ filesize: 1337, senpath: 'memes/itsdatboi.mov', senUIFolder: false, redundancy: 2.0, available: true, uploadprogress: 20 },
				{ filesize: 1337, senpath: 'memes/rares/lordkek.gif', senUIFolder: false, redundancy: 1.6, available: true, uploadprogress: 30 },
				{ filesize: 13117, senpath: 'sibyl_system.avi', senUIFolder: false, redundancy: 1.0, available: true, uploadprogress: 75 },
				{ filesize: 13117, senpath: 'test_0bytes.avi', senUIFolder: false, redundancy: -1, available: true, uploadprogress: 100 },
				{ filesize: 1331, senpath: 'doggos/borkborkdoggo.png', senUIFolder: false, redundancy: 1.5, available: true, uploadprogress: 100 },
				{ filesize: 1333, senpath: 'doggos/snip_snip_doggo_not_bork_bork_kind.jpg', senUiFolder: false, redundancy: 1.0, available: true, uploadprogress: 100 },
			])
			const expectedOutputs = {
				'': List([
					{ size: readableFilesize(1331+1333), name: 'doggos', senpath: 'doggos/', redundancy: 1.0, available: true, senUIFolder: false, uploadprogress: 100, type: 'directory' },
					{ size: readableFilesize(1337+13117), name: 'folder', senpath: 'folder/', redundancy: 2.0, available: true, senUIFolder: false, uploadprogress: 50, type: 'directory' },
					{ size: readableFilesize(1317+1337+1337), name: 'memes', senpath: 'memes/', redundancy: 1.6, available: true, senUIFolder: false, uploadprogress: 10, type: 'directory' },
					{ size: readableFilesize(1237), name: 'rare_pepe.png', senpath: 'rare_pepe.png', redundancy: 2.0, available: true, senUIFolder: false, uploadprogress: 100, type: 'file' },
					{ size: readableFilesize(13117), name: 'sibyl_system.avi', senpath: 'sibyl_system.avi', redundancy: 1.0, available: true, senUIFolder: false, uploadprogress: 75, type: 'file' },
					{ size: readableFilesize(13117), name: 'test_0bytes.avi', senpath: 'test_0bytes.avi', redundancy: -1.0, available: true, senUIFolder: false, uploadprogress: 100, type: 'file'},
				]),
				'doggos/': List([
					{ size: readableFilesize(1331), name: 'borkborkdoggo.png', senpath: 'doggos/borkborkdoggo.png', redundancy: 1.5, available: true, senUIFolder: false, uploadprogress: 100, type: 'file' },
					{ size: readableFilesize(1333), name: 'snip_snip_doggo_not_bork_bork_kind.jpg', redundancy: 1.0, senpath: 'doggos/snip_snip_doggo_not_bork_bork_kind.jpg', available: true, senUIFolder: false, uploadprogress: 100, type: 'file' },
				]),
				'memes/': List([
					{ size: readableFilesize(1337), name: 'rares', senpath: 'memes/rares/', available: true, senUIFolder: false,  redundancy: 1.6, uploadprogress: 30, type: 'directory' },
					{ size: readableFilesize(1337), name: 'itsdatboi.mov', senpath: 'memes/itsdatboi.mov', redundancy: 2.0, senUIFolder: false, available: true, uploadprogress: 20, type: 'file' },
					{ size: readableFilesize(1317), name: 'waddup.png', senpath: 'memes/waddup.png', available: true, senUIFolder: false, redundancy: 2.5, uploadprogress: 10, type: 'file' },
				]),
			}
			for (const path in expectedOutputs) {
				const output = ls(senpathInputs, path)
				const outputWin32 = lsWin32(senpathInputs, path)
				expect(output).to.deep.equal(outputWin32)
				expect(output.size).to.equal(expectedOutputs[path].size)
				expect(output.toObject()).to.deep.equal(expectedOutputs[path].toObject())
			}
		})
		it('should work with senpaths that have a folder or file ending in ..', () => {
			const senpathInputs = List([
				{ filesize: 1000, senpath: 'test/test/..test.png', senUIFolder: false, redundancy: 2.0, available: true, uploadprogress: 100 },
				{ filesize: 1000, senpath: 'test/test../test.png', senUIFolder: false, redundancy: 2.0, available: true, uploadprogress: 100},
			])
			const expectedOutputs = {
				'': List([
					{ size: readableFilesize(1000+1000), name: 'test', senpath: 'test/', senUIFolder: false, redundancy: 2.0, available: true, uploadprogress: 100, type: 'directory' },
				]),
				'test': List([
					{ size: readableFilesize(1000), name: 'test', senpath: 'test/test/', senUIFolder: false, redundancy: 2.0, available: true, uploadprogress: 100, type: 'directory' },
					{ size: readableFilesize(1000), name: 'test..', senpath: 'test/test../', redundancy: 2.0, senUIFolder: false, available: true, uploadprogress: 100, type: 'directory' },
				]),
				'test/test': List([
					{ size: readableFilesize(1000), name: '..test.png', senpath: 'test/test/..test.png', redundancy: 2.0, senUIFolder: false, available: true, uploadprogress: 100, type: 'file' },
				]),
			}
			for (const path in expectedOutputs) {
				const output = ls(senpathInputs, path)
				const outputWin32 = lsWin32(senpathInputs, path)
				expect(output).to.deep.equal(outputWin32)
				expect(output.size).to.equal(expectedOutputs[path].size)
				expect(output.toObject()).to.deep.equal(expectedOutputs[path].toObject())
			}
		})
	})
	describe('minRedundancy', () => {
		it('returns correct values for list of size 0', () => {
			expect(minRedundancy(List())).to.equal(0)
		})
		it('returns correct values given a list of files', () => {
			expect(minRedundancy(List([{redundancy: 0.5}, {redundancy: 1.2}, {redundancy: 1.3}, {redundancy: 0.2}]))).to.equal(0.2)
		})
		it('ignores negative redundancy values', () => {
			expect(minRedundancy(List([{redundancy: -1}, {redundancy: 1.5}, {redundancy: 1.1}]))).to.equal(1.1)
		})
		it('returns correct values for a list of only negative redundancy', () => {
			expect(minRedundancy(List([{redundancy: -1}, {redundancy: -1}]))).to.equal(-1)
		})
	})
	describe('minUpload', () => {
		it('returns correct values for list of size 0', () => {
			expect(minUpload(List())).to.equal(0)
		})
		it('returns correct values given a list of files', () => {
			expect(minUpload(List([{uploadprogress: 10}, {uploadprogress: 25}, {uploadprogress: 100}, {uploadprogress: 115}]))).to.equal(10)
		})
	})
	describe('buildTransferTimes', () => {
		it('correctly appends new transfers to a set of previous transfer times', () => {
			const previousTransferTimes = Map({
				'senpath1': { timestamps: [1, 2], bytes: [10, 20] },
				'senpath2': { timestamps: [1, 2, 3, 4, 5], bytes: [10, 20, 30, 40, 50] },
			})
			const transfers = List([
				{ senpath: 'senpath1', bytestransferred: 60 },
				{ senpath: 'senpath2', bytestransferred: 70 },
				{ senpath: 'senpath3', bytestransferred: 80 },
			])
			const transferTimes = buildTransferTimes(previousTransferTimes, transfers)
			expect(transferTimes.get('senpath1').timestamps.length).to.equal(3)
			expect(transferTimes.get('senpath1').bytes.length).to.equal(3)
			expect(transferTimes.get('senpath1').bytes[2]).to.equal(60)
			expect(transferTimes.get('senpath2').timestamps.length).to.equal(5)
			expect(transferTimes.get('senpath2').bytes.length).to.equal(5)
			expect(transferTimes.get('senpath2').timestamps[0]).to.equal(2)
			expect(transferTimes.get('senpath2').bytes[0]).to.equal(20)
			expect(transferTimes.get('senpath2').bytes[4]).to.equal(70)
			expect(transferTimes.get('senpath3').timestamps.length).to.equal(1)
			expect(transferTimes.get('senpath3').bytes.length).to.equal(1)
			expect(transferTimes.get('senpath3').bytes[0]).to.equal(80)
		})
	})
	describe('addTransferSpeeds', () => {
		it('correctly appends speeds to a set of previous transfer times', () => {
			const transferTimes = Map({
				'senpath1': { timestamps: [1, 2000], bytes: [10, 4000000] },
				'senpath2': { timestamps: [1, 2, 3, 4, 5000], bytes: [10, 20, 30, 40, 10000] },
				'senpath3': { timestamps: [1000, 2000], bytes: [50, 60] },
			})
			const untimedTransfers = List([
				{ senpath: 'senpath1', bytestransferred: 4000000 },
				{ senpath: 'senpath2', bytestransferred: 10000 },
				{ senpath: 'senpath3', bytestransferred: 60 },
			])
			const timedTransfers = addTransferSpeeds(untimedTransfers, transferTimes)
			expect(timedTransfers.get(0).speed).to.equal('2 MB/s')
			expect(timedTransfers.get(1).speed).to.equal('2 KB/s')
			expect(timedTransfers.get(2).speed).to.equal('10 B/s')
		})
	})
	describe('searchFiles', () => {
		it('parses a file tree and returns expected search results', () => {
			const files = List([
				{ senpath: 'test/test1/testfile' },
				{ senpath: 'test/test1/testaaa' },
				{ senpath: 'test/test2/testfile2' },
				{ senpath: 'test/test3/testfile3' },
				{ senpath: 'test2/asdf.mov' },
				{ senpath: 'test/testuifolder', senUIFolder: true},
			])

			expect(searchFiles(files, '', 'test/testuifolder').size).to.equal(0)
			expect(searchFiles(files, 'testuifolder', 'test/testuifolder/').size).to.equal(0)

			expect(searchFiles(files, 'test1', 'test/').size).to.equal(1)
			expect(searchFiles(files, 'test1', 'test/').get(0).type).to.equal('directory')
			expect(searchFiles(files, 'test1', 'test/').get(0).name).to.equal('test1')

			expect(searchFiles(files, 'test2', 'test/').size).to.equal(1)
			expect(searchFiles(files, 'test2', 'test/').get(0).name).to.equal('test2')
			expect(searchFiles(files, 'test2', 'test/').get(0).type).to.equal('directory')

			expect(searchFiles(files, 'test3', 'test/').size).to.equal(1)
			expect(searchFiles(files, 'test3', 'test/').get(0).type).to.equal('directory')

			expect(searchFiles(files, 'testfile', 'test/').size).to.equal(3)
			expect(searchFiles(files, 'testfile', 'test/').get(0).type).to.equal('file')
			expect(searchFiles(files, 'testfile', 'test/').get(0).name).to.equal('testfile')
			expect(searchFiles(files, 'testfile', 'test/').get(1).type).to.equal('file')
			expect(searchFiles(files, 'testfile', 'test/').get(1).name).to.equal('testfile2')
			expect(searchFiles(files, 'testfile', 'test/').get(2).type).to.equal('file')
			expect(searchFiles(files, 'testfile', 'test/').get(2).name).to.equal('testfile3')

			expect(searchFiles(files, 'testuifolder', 'test/').size).to.equal(1)
			expect(searchFiles(files, 'testuifolder', 'test/').get(0).type).to.equal('directory')
			expect(searchFiles(files, 'testuifolder', 'test/').get(0).name).to.equal('testuifolder')
		})
	})
})
