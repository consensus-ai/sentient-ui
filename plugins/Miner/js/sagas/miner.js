import { put, take, fork, call, join, race } from 'redux-saga/effects'
import { takeEvery, delay } from 'redux-saga'
import { sentientdCall, startMiningProcess, poolServerCall} from './helpers.js'
import fs from 'graceful-fs'
import * as actions from '../actions/miner.js'
import * as constants from '../constants/miner.js'
import { List } from 'immutable'
import { toast } from 'react-toastify'

// Send an error notification.
const sendError = (e) => {
	SentientAPI.showError({
		title: 'Sentient-UI Wallet Error',
		content: typeof e.message !== 'undefined' ? e.message : e.toString(),
	})
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

function* setMiningTypeSaga(action) {
	const miningType = action.miningType
	SentientAPI.config.attr('miningType', miningType)
	try {
		SentientAPI.config.save()
	} catch (e) {
		console.error(`error saving config: ${e.toString()}`)
	}
	yield put(actions.setMiningType(miningType))
}

function* getMiningTypeSaga() {
	const miningType = SentientAPI.config.attr('miningType')
	yield put(actions.setMiningType(miningType || constants.POOL))
}

// Before starting miner check if Miner Payout Address exists
// If not - create new
function* startMinerSaga() {
	try {
		const miningType = SentientAPI.config.attr('miningType')
		let payoutAddress = SentientAPI.config.attr('payoutAddress')

		if ((!miningType || miningType == constants.POOL) && !payoutAddress) {
			const response = yield sentientdCall('/wallet/address')
			const payoutAddress = response.address
			// save address
			SentientAPI.config.attr('payoutAddress', payoutAddress)
			// add to existing collection
			let addrs = List(SentientAPI.config.attr('receiveAddresses'))
			addrs = addrs.push({address: payoutAddress, description: 'Miner Payout Address'})
			SentientAPI.config.attr('receiveAddresses', addrs.toArray())
			SentientAPI.config.save()
		}
		const pid = startMiningProcess()
		yield put(actions.setMiningStatus(true, pid))
	} catch (e) {
		console.error('error starting miner: ' + e.toString())
	}
}

function* stopMinerSaga(action) {
	try {
		process.kill(action.pid)
		yield put(actions.setMiningStatus(false, null))
	} catch (e) {
		console.error('error stopping miner: ' + e.toString())
	}
}

function* setPoolSharesEfficiencySaga() {
	try {
		const payoutAddress = SentientAPI.config.attr('payoutAddress')
		const sharesEfficiency = yield poolServerCall(`/pool/clients/${payoutAddress}/shares/stats`)
		const balance = yield poolServerCall(`/pool/clients/${payoutAddress}/balance`)

		yield put(actions.updatePoolStats(sharesEfficiency, balance))
	} catch (e) {
		console.error('error fetching shares efficiency: ' + e.toString())
	}
}

function* getHashrateHistorySaga(action) {
	try {
		const duration = action && action.duration || 24*60*60
		const logFilePath = `${SentientAPI.config.sentientd.datadir}/hashrates.log`
		const timeOffset =  Math.floor(Date.now() / 1000) - duration

		let hashrateData = []
		const data = fs.readFileSync(logFilePath).toString().split("\n");
		data.forEach((line) => {
			let [timestamp, hashRate] = line.split(",")
			const logTime = parseInt(timestamp)
			if (logTime >= timeOffset) {
				hashrateData.push({hashrate: parseFloat(hashRate).toFixed(2), time: logTime})
			}
		})
		yield put(actions.setHashrateHistory(hashrateData))
	} catch (e) {
		console.error('error getting hashrate: ' + e.toString())
	}
}

// exported redux-saga action watchers
export function* dataFetcher() {
	while (true) {
		let tasks = []
		tasks = tasks.concat(yield fork(getWalletBalanceSaga))
		// tasks = tasks.concat(yield fork(getHashrateHistoryLogsSaga))
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

export function* watchGetMiningType() {
	yield* takeEvery(constants.GET_MINING_TYPE, getMiningTypeSaga)
}

export function* watchGetHashrateHistory() {
	yield* takeEvery(constants.GET_HASHRATE_HISTORY, getHashrateHistorySaga)
}

export function* watchSetHashrateHistory() {
	yield* takeEvery(constants.SET_MINING_STATUS, getHashrateHistorySaga)
}


export function* watchUpdateMiningHasrate() {
	yield* takeEvery(constants.UPDATE_MINING_HASH_RATE, setPoolSharesEfficiencySaga)
}