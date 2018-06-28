import { put, take, fork, call, join, race } from 'redux-saga/effects'
import { takeEvery, delay } from 'redux-saga'
import { sentientdCall } from './helpers.js'
import * as actions from '../actions/miner.js'
import * as constants from '../constants/miner.js'
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
function* getLockStatusSaga() {
	try {
		const response = yield sentientdCall('/wallet')
		if (!response.unlocked) {
			yield put(actions.setWalletLocked(true))
		} else {
			yield put(actions.setWalletLocked(false))
		}
	} catch (e) {
		console.error('error fetching lock status: ' + e.toString())
	}
}

function* getMiningStatusSaga() {
	try {
		const response = yield sentientdCall('/miner')
		if (!response) {
			yield put(actions.setMiningStatus({}))
		} else {
			yield put(actions.setMiningStatus(response))
		}
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
		tasks = tasks.concat(yield fork(getLockStatusSaga))
		tasks = tasks.concat(yield fork(getMiningStatusSaga))
		yield join(...tasks)
		yield race({
			task: call(delay, 2000),
			cancel: take(constants.FETCH_DATA),
		})
	}
}

export function* watchGetLockStatus() {
	yield* takeEvery(constants.GET_LOCK_STATUS, getLockStatusSaga)
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

