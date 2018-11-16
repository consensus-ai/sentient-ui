import { put, take, fork, call, join, race } from 'redux-saga/effects'
import { takeEvery, delay } from 'redux-saga'
import { sentientdCall } from './helpers.js'
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
		const walletResponse    = yield sentientdCall('/wallet')

		const confirmed = SentientAPI.hastingsToSen(walletResponse.confirmedsenbalance)
		const unlocked  = walletResponse.unlocked
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
	yield put(actions.setMiningType(miningType || 'pool'))
}

function* getMiningStatusSaga() {
	try {
		// const response = yield sentientdCall('/miner')
		// if (!response) {
		// 	yield put(actions.setMiningStatus({}))
		// } else {
		// 	yield put(actions.setMiningStatus(response))
		// }
	} catch (e) {
		console.error('error fetching mining status: ' + e.toString())
	}
}

function* startMinerSaga() {
	try {
		const response = yield sentientdCall('/miner/start')
		yield put(actions.getMiningStatus())
	} catch (e) {
		console.error('error starting miner: ' + e.toString())
	}
}

function* stopMinerSaga() {
	try {
		const response = yield sentientdCall('/miner/stop')
		yield put(actions.getMiningStatus())
	} catch (e) {
		console.error('error stopping miner: ' + e.toString())
	}
}

// exported redux-saga action watchers
export function* dataFetcher() {
	while (true) {
		let tasks = []
		tasks = tasks.concat(yield fork(getWalletBalanceSaga))
		tasks = tasks.concat(yield fork(getMiningStatusSaga))
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

export function* watchGetMiningStatus() {
	yield* takeEvery(constants.GET_MINING_STATUS, getMiningStatusSaga)
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
