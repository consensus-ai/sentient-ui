import { put, take, fork, call, join, race } from 'redux-saga/effects'
import { takeEvery, delay } from 'redux-saga'
import { sentientdCall } from './helpers.js'
import * as actions from '../actions/topic.js'
import * as constants from '../constants/topic.js'
import * as errors from '../constants/error.js'
import { remote } from 'electron'
const analytics = remote.getGlobal('analytics')

// Send an error notification.
const sendError = (e) => {
	SentientAPI.showError({
		title: 'Sentient Hub Wallet Error',
		content: typeof e.message !== 'undefined' ? e.message : e.toString(),
	})
}

// Topic plugin sagas
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
