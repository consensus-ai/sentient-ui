import { put, take, fork, call, join, race } from 'redux-saga/effects'
import { takeEvery, delay, eventChannel, END } from 'redux-saga'
import { sentientdCall, startMiningProcess, poolServerCall, formatHashrate, formatHistory, getHashRate } from './helpers.js'
import * as actions from '../actions/miner.js'
import * as constants from '../constants/miner.js'
import { remote } from 'electron'
const analytics = remote.getGlobal('analytics')
import { List } from 'immutable'
const groupOptions = {
	86400: 600, // 10 minutes
	604800: 3600, // 1 hour
	2592000: 18000, // 5 hours
}
let hashrates = []

// Send an error notification.
const sendError = (e) => {
	SentientAPI.showError({
		title: 'Sentient-UI Wallet Error',
		content: typeof e.message !== 'undefined' ? e.message : e.toString(),
	})
}

// Save Mining Type to config.
const saveMiningType = (miningType) => {
	try {
		SentientAPI.config.attr('miningType', miningType)
		SentientAPI.config.save()
	} catch (e) {
		console.error(`error saving config: ${e.toString()}`)
	}
}

// Miner plugin sagas
// Sagas are an elegant way of handling asynchronous side effects.
// All side effects logic is contained entirely in this file.
// See https://github.com/yelouafi/redux-saga to read more about redux-saga.

//  Call /wallet and dispatch the appropriate actions from the returned JSON.
function* getWalletBalanceSaga() {
	try {
		const wallet    = yield sentientdCall('/wallet')
		const confirmed = SentientAPI.hastingsToSen(wallet.confirmedsenbalance)
		const unlocked  = wallet.unlocked
		yield put(actions.setWalletBalance(confirmed.round(2).toString(), unlocked))
	} catch (e) {
		console.error('error fetching lock status: ' + e.toString())
	}
}

// Save mining type to config
function* setMiningTypeSaga(action) {
	const miningType = action.miningType
	saveMiningType(miningType)
	yield put(actions.setMiningType(miningType))
}

// Load mining type from config
function* getMiningTypeSaga() {
	let miningType = SentientAPI.config.attr('miningType')
	if (!miningType) {
		miningType = 'pool'
		saveMiningType(miningType)
	}
	yield put(actions.setMiningType(miningType))
}

// Checking for Miner Payout Address, create a new if null
function* getPayoutAddress() {
	let payoutAddress = SentientAPI.config.attr('payoutAddress')

	if (!payoutAddress) {
		const response = yield sentientdCall('/wallet/address')
		payoutAddress = response.address
		// save address
		SentientAPI.config.attr('payoutAddress', payoutAddress)
		// add to existing collection
		let addrs = List(SentientAPI.config.attr('receiveAddresses'))
		addrs = addrs.push({address: payoutAddress, description: 'Miner Payout Address'})
		SentientAPI.config.attr('receiveAddresses', addrs.toArray())
		SentientAPI.config.save()
	}
	return payoutAddress
}

// Executing start miner command
function* startMinerSaga() {
	try {
		const process = yield startMiningProcess()
		// Send GA on open APP
		analytics.event('App', 'start-miner', { clientID: SentientAPI.config.userid })
		yield put(actions.setMiningStatus(true, process.pid))
		const channel = eventChannel(emitter => {
			process.on('error', (err) => {
				sendError('Sentient Miner has experienced a fatal error')
				emitter({ stop:  true })
				emitter(END)
			})
			process.on('exit', (code) => {
				emitter({ stop:  true })
				emitter(END)
			})
			return () => {	}
		})
		 // Process events until operation completes
		 while (true) {
			const { stop } = yield take(channel)
			if (stop) {
				yield call(stopMinerSaga)
			}
		}
	} catch (e) {
		// Stop miner process for UI
		yield call(stopMinerSaga)
		console.error('error starting miner')
		console.error(e)
	}
}

// Executing stop miner command
function* stopMinerSaga(action) {
	try {
		yield put(actions.setMiningStatus(false, null))
		if(action) {
			process.kill(action.pid)
		}
	} catch (e) {
		console.error('error stopping miner: ' + e.toString())
	}
}

// Getting Unpaid Balance
function* getUnpaidBalance(address) {
	try {
		return yield poolServerCall(`/pool/clients/${address}/balance`)
	} catch (e) {
		return { paid: 0, unpaid: 0 }
	}
}

// Getting Shares Efficiency
function* getSharesEfficiency(address) {
	try {
		return yield poolServerCall(`/pool/clients/${address}/shares/stats`)
	} catch (e) {
		return { submitted: 0, accepted: 0, rejected: 0, stale:0 }
	}
}

// Get data for display in the UI
function* getDataForDisplaySaga(action) {
	try {
		const payoutAddress = yield call(getPayoutAddress)

		const balance = yield call(getUnpaidBalance, payoutAddress)
		const sharesEfficiency = yield call(getSharesEfficiency, payoutAddress)

		yield getHashrateHistorySaga(action)
		yield getPoolStatsHistorySaga(action)
		yield put(actions.updateSharesEfficiency(sharesEfficiency))
		yield put(actions.updateUnpaidBalance(balance))
	} catch (e) {
		console.error('error fetching data for display')
		console.error(e)
	}
}

// Get hashrates history
function* getHashrateHistorySaga(action) {
	try {
		const duration = action.duration || 86400
		const timeOffset =  Math.floor(Date.now() / 1000) - duration
		const payoutAddress = yield call(getPayoutAddress)
		const minerName = SentientAPI.config.attr('minerName')

		const hashrateHistory = yield poolServerCall(`/pool/clients/${payoutAddress}/workers/${minerName}/hashrate/historics?start_timestamp=${timeOffset}&interval=${groupOptions[duration]}`)
		const hashrateData = formatHashrate(hashrateHistory, timeOffset, groupOptions[duration])
		yield put(actions.setHashrateHistory(hashrateData))
	} catch (e) {
		console.error('error getting hashrate: ' + e.toString())
	}
}

// Get pool stats history
function* getPoolStatsHistorySaga(action) {
	try {
		const duration = action.duration || 86400
		const timeOffset =  Math.floor(Date.now() / 1000) - duration
		const payoutAddress = yield call(getPayoutAddress)
		const minerName = SentientAPI.config.attr('minerName')

		const poolStatsHistory = yield poolServerCall(`/pool/clients/${payoutAddress}/workers/${minerName}/shares/historics?start_timestamp=${timeOffset}&interval=${groupOptions[duration]}`)

		const poolData = formatHistory(poolStatsHistory, timeOffset, groupOptions[duration])

		yield put(actions.setPoolStatsHistory(poolData))
	} catch (e) {
		console.error('error getting pool stats')
		console.error(e)
	}
}

// Getting current hashrate
function* getCurrentHashRateSaga() {
	try {
		const data = yield getHashRate()
		if (!isNaN(parseInt(data.hashrate))) {
			hashrates.push(data.hashrate)
			yield put(actions.setHashRate(data.hashrate))
		}
	} catch(e) {
		console.log('error getting hashrate: ' + e.toString())
	}
}

// Getting current hashrate for displaying in the local miner graph
function* getCurrentHashrateForGraphSaga() {
	try {
		if (hashrates.length) {
			let hashrateForDisplay = hashrates.reduce((a, b) => a + b, 0) / hashrates.length
			hashrates = []
			yield put(actions.setCurrentHashrate(hashrateForDisplay, Math.floor(Date.now() / 1000)))
		}
	} catch(e) {
		console.log('error getting current hashrate: ' + e.toString())
	}
}

// exported redux-saga action watchers
export function* dataFetcher() {
	while (true) {
		let tasks = []
		tasks = tasks.concat(yield fork(getWalletBalanceSaga))
		yield join(...tasks)
		yield race({
			task: call(delay, 2000),
			cancel: take(constants.FETCH_DATA),
		})
	}
}

export function* watchWalletBalance() {
	yield* takeEvery(constants.GET_WALLET_BALANCE, getWalletBalanceSaga)
}

export function* watchStartMiner() {
	yield* takeEvery(constants.START_MINER, startMinerSaga)
}

export function* watchStopMiner() {
	yield* takeEvery(constants.STOP_MINER, stopMinerSaga)
}

export function* watchSetMiningType() {
	yield* takeEvery(constants.CHANGE_MINING_TYPE, setMiningTypeSaga)
}

export function* watchDataForDisplay() {
	yield* takeEvery(constants.GET_DATA_FOR_DISPLAY, getDataForDisplaySaga)
}

export function* watchGetMiningType() {
	yield* takeEvery(constants.GET_MINING_TYPE, getMiningTypeSaga)
}

export function* watchGetHashrateHistory() {
	yield* takeEvery(constants.GET_HASHRATE_HISTORY, getHashrateHistorySaga)
}

export function* watchGetCurrentHashrate() {
	yield* takeEvery(constants.GET_CURRENT_HASH_RATE, getCurrentHashrateForGraphSaga)
}

export function* watchGetPoolStatsHistory() {
	yield* takeEvery(constants.GET_POOL_STATS_HISTORY, getPoolStatsHistorySaga)
}

export function* watchGetCurrentHashRate() {
	yield* takeEvery(constants.GET_HASH_RATE, getCurrentHashRateSaga)
}
