import { put, take, fork, call, join, race } from 'redux-saga/effects'
import { takeEvery, delay } from 'redux-saga'
import { sentientdCall, parseRawTransactions } from './helpers.js'
import { userFriendlyError } from './error_helpers.js'
import * as actions from '../actions/wallet.js'
import * as constants from '../constants/wallet.js'
import { walletUnlockError } from '../actions/error.js'
import { List } from 'immutable'
import { toast } from 'react-toastify'

// Send an error notification.
const sendError = (e) => {
	SentientAPI.showError({
		title: 'Sentient-UI Wallet Error',
		content: userFriendlyError(e),
	})
}

// Wallet plugin sagas
// Sagas are an elegant way of handling asynchronous side effects.
// All side effects logic is contained entirely in this file.
// See https://github.com/yelouafi/redux-saga to read more about redux-saga.

//  Call /wallet and dispatch the appropriate actions from the returned JSON.
function* getLockStatusSaga() {
	try {
		const response = yield sentientdCall('/wallet')
		if (!response.unlocked) {
			yield put(actions.setLocked())
		} else {
			yield put(actions.setUnlocked())
		}
		if (response.encrypted) {
			yield put(actions.setEncrypted())
		} else {
			yield put(actions.setUnencrypted())
		}
		yield put(actions.setRescanning(response.rescanning))
	} catch (e) {
		console.error('error fetching lock status: ' + e.toString())
	}
}

// Call /wallet/unlock and dispatch setEncrypted and setUnlocked.
// Since sentientdCall is a promise which rejects on error, API errors will be caught.
// Dispatch any API errors as a walletUnlockError action.
function* walletUnlockSaga(action) {
	try {
		yield sentientdCall({
			url: '/wallet/unlock',
			method: 'POST',
			timeout: 1.728e8, // two-day timeout, unlocking can take a long time
			qs: {
				encryptionpassword: action.password,
			},
		})
		yield put(actions.setEncrypted())
		yield put(actions.setUnlocked())
		yield put(actions.handlePasswordChange(''))
		yield put(walletUnlockError(''))
		yield put(actions.showTransactionListView())
	} catch (e) {
		yield put(actions.handlePasswordChange(''))
		yield put(walletUnlockError(userFriendlyError(e)))
		toast.error(userFriendlyError(e), { autoClose: 7000 })
	}
}

function* walletLockSaga() {
	try {
		yield sentientdCall({
			url: '/wallet/lock',
			method: 'POST',
		})
		yield put(actions.setEncrypted())
		yield put(actions.setLocked())
	} catch (e) {
		sendError(e)
	}
}

// Call /wallet/init to create a new wallet, show the user the newWalletDialog,
// Wait for the user to close the dialog, then unlock the wallet using the primary seed.
function* createWalletSaga(action) {
	const initSeed = typeof action.seed !== 'undefined'
	try {
		let response
		if (initSeed) {
			yield put(actions.initSeedStarted())
			response = yield sentientdCall({
				url: '/wallet/init/seed',
				method: 'POST',
				timeout: 1.7e8, // two days
				qs: {
					dictionary: 'english',
					encryptionpassword: action.password,
					seed: action.seed,
				},
			})
			yield put(actions.initSeedFinished())
		} else {
			response = yield sentientdCall({
				url: '/wallet/init',
				method: 'POST',
				qs: {
					dictionary: 'english',
					encryptionpassword: action.password,
				},
			})
		}

		if (!initSeed && typeof action.password === 'undefined' || action.password === '') {
			yield put(actions.showNewWalletDialog(response.primaryseed, response.primaryseed))
		} else if (!initSeed) {
			yield put(actions.showNewWalletDialog(action.password, response.primaryseed))
		}

		yield take(constants.SET_UNLOCKED)
		yield put(actions.dismissNewWalletDialog())
	} catch (e) {
		if (initSeed) {
			yield put(actions.initSeedFinished())
		}
		sendError(e)
	}
}

// Call /wallet/init to create a new wallet, show the user the seed view,
// wait for user to close the view, then unlock the wallet with the password,
// and show the transactions view
function* initNewWalletSaga(action) {
	let response
	const seedProvided = !!action.seed

	if (seedProvided) {
		try {
			response = yield sentientdCall({
				url: '/wallet/init/seed',
				method: 'POST',
				timeout: 1.7e8, // two days
				qs: {
					dictionary: 'english',
					encryptionpassword: action.password,
					seed: action.seed,
				},
			})
			yield put(actions.setShowImportSeedView(false))
			yield put(actions.setShowWalletInitializingView(true))
		} catch (e) {
			let errorContent = typeof e.message !== 'undefined' ? e.message : e.toString()
			toast.error(userFriendlyError(e), { autoClose: 7000 })
		}
	} else {
		try {
			response = yield sentientdCall({
				url: '/wallet/init',
				method: 'POST',
				qs: {
					dictionary: 'english',
					encryptionpassword: action.password,
				},
			})
			yield put(actions.setShowGenerateSeedView(false))
			yield put(actions.setShowBackupSeedView(true, response.primaryseed))
		} catch (e) {
			let errorContent = typeof e.message !== 'undefined' ? e.message : e.toString()
			toast.error(userFriendlyError(e), { autoClose: 7000 })
		}
	}
}

// call /wallet and compute the confirmed balance as well as the unconfirmed delta.
function* getBalanceSaga() {
	try {
		const response = yield sentientdCall('/wallet')
		const confirmed = SentientAPI.hastingsToSen(response.confirmedsenbalance)
		const unconfirmedIncoming = SentientAPI.hastingsToSen(response.unconfirmedincomingsen)
		const unconfirmedOutgoing = SentientAPI.hastingsToSen(response.unconfirmedoutgoingsen)
		const unconfirmed = unconfirmedIncoming.minus(unconfirmedOutgoing)

		const consensusResponse = yield sentientdCall('/consensus')
		const synced = consensusResponse.synced
		yield put(actions.setBalance(synced, confirmed.round(2).toString(), unconfirmed.round(2).toString()))
	} catch (e) {
		console.error('error fetching balance: ' + e.toString())
	}
}

// Get all the transactions from /wallet transactions, parse them, and dispatch setTransactions()
function* getTransactionsSaga() {
	try {
		const response = yield sentientdCall('/wallet/transactions?startheight=0&endheight=0')
		const transactions = parseRawTransactions(response)
		yield put(actions.setTransactions(transactions))
	} catch (e) {
		console.error('error fetching transactions: ' + e.toString())
	}
}


function* showTransactionListViewSaga() {
	try {
		const response = yield sentientdCall('/wallet/transactions?startheight=0&endheight=0')
		const transactions = parseRawTransactions(response)
		yield put(actions.setTransactions(transactions))
	} catch (e) {
		console.error('error fetching transactions: ' + e.toString())
	}
}

function* showReceiveViewSaga() {
	try {
		const cachedAddrs = List(SentientAPI.config.attr('receiveAddresses'))
		// validate the addresses. if this node has no record of an address, prune
		// it.
		const response = yield sentientdCall('/wallet/addresses')
		const validCachedAddrs = cachedAddrs.filter((addr) => response.addresses.includes(addr.address))
		SentientAPI.config.attr('receiveAddresses', validCachedAddrs.toArray())
		yield put(actions.setReceiveAddresses(validCachedAddrs))
		yield put(actions.getNewReceiveAddress())
		yield put(actions.setAddressDescription(''))
	} catch (e) {
		console.error(e)
		sendError(e)
	}
}

// updateAddressDescriptionSaga handles UPDATE_ADDRESS_DESCRIPTION actions, updating
// the the address object in the config
function* updateAddressDescriptionSaga(action) {
	let addrs = List(SentientAPI.config.attr('receiveAddresses'))

	addrs.forEach((addr) => {
		if (addr.address == action.address.address) {
			addr.description = action.address.description
			try {
				SentientAPI.config.save()
			} catch (e) {
				console.error(`error saving config: ${e.toString()}`)
			}
		}
	})

	yield put(actions.setReceiveAddresses(addrs))
}

// saveAddressSaga handles SAVE_ADDRESS actions, adding the address object to
// the collection of stored Sentient-UI addresses and dispatching any necessary
// resulting actions.
function* saveAddressSaga(action) {
	let addrs = List(SentientAPI.config.attr('receiveAddresses'))

	// save the address to the collection
	addrs = addrs.filter((addr) => addr.address !== action.address.address)
	addrs = addrs.push(action.address)
	// validate the addresses. if this node has no record of an address, prune
	// it.
	const response = yield sentientdCall('/wallet/addresses')
	const validAddrs = addrs.filter((addr) => response.addresses.includes(addr.address))
	SentientAPI.config.attr('receiveAddresses', validAddrs.toArray())
	try {
		SentientAPI.config.save()
	} catch (e) {
		console.error(`error saving config: ${e.toString()}`)
	}

	yield put(actions.setReceiveAddresses(validAddrs))
}

function* getNewReceiveAddressSaga() {
	try {
		const response = yield sentientdCall('/wallet/address')
		SentientAPI.config.attr('receiveAddress', response.address)
		yield put(actions.setReceiveAddress(response.address))
	} catch (e) {
		console.error(`error getting receive address: ${e.toString()}`)
	}
}

// call /wallet/sweep/seed to recover money from a seed
function* recoverSeedSaga(action) {
	try {
		yield put(actions.seedRecoveryStarted())
		yield sentientdCall({
			url: '/wallet/sweep/seed',
			method: 'POST',
			timeout: 2e8,
			qs: {
				seed: action.seed,
			},
		})
		yield put(actions.seedRecoveryFinished())
		yield new Promise((resolve) => setTimeout(resolve, 1000))
		yield put(actions.hideSeedRecoveryDialog())
	} catch (e) {
		yield put(actions.seedRecoveryFinished())
		yield put(actions.hideSeedRecoveryDialog())
		sendError(e)
	}
}

function* sendCurrencySaga(action) {
	try {
		if (action.currencytype === undefined || action.amount === undefined || action.destination === undefined || action.amount === '' || action.currencytype === '' || action.destination === '') {
			throw { message: 'You must specify an amount and a destination to send Sen!' }
		}
		if (action.currencytype !== 'senfunds' && action.currencytype !== 'sen') {
			throw { message: 'Invalid currency type!' }
		}
		const sendAmount = action.currencytype === 'sen' ? SentientAPI.senToHastings(action.amount).toString() : action.amount

		yield sentientdCall({
			url: '/wallet/' + action.currencytype,
			method: 'POST',
			qs: {
				destination: action.destination,
				amount: sendAmount,
			},
		})

		yield put(actions.getBalance())
		yield put(actions.getTransactions())
		yield put(actions.setSendAmount(''))
		yield put(actions.setSendAddress(''))
		yield put(actions.hideAllViews())
		yield put(actions.showTransactionListView())
		toast("Transaction submitted", { autoClose: 7000 })
	} catch (e) {
		yield put(actions.setSendError(userFriendlyError(e)))
		toast.error(userFriendlyError(e), { autoClose: 12000 })
	}
}

// changePasswordSaga listens for CHANGE_PASSWORD actions and performs the
// necessary API calls.
function* changePasswordSaga(action) {
	try {
		yield sentientdCall({
			url: '/wallet/changepassword',
			method: 'POST',
			timeout: 2e8,
			qs: {
				encryptionpassword: action.currentpassword,
				newpassword: action.newpassword,
			},
		})
		yield put(actions.setChangePasswordError('password changed successfully.'))
	} catch (e) {
		yield put(actions.setChangePasswordError(userFriendlyError(e)))
	}
}


function *showSendViewSaga() {
	try {
		const response = yield sentientdCall('/tpool/fee')
		const feeEstimate = SentientAPI.hastingsToSen(response.maximum).times(1e3).round(8).toString() + ' SEN/KB'
		yield put(actions.setFeeEstimate(feeEstimate))
	} catch (e) {
		console.error('error fetching fee estimate for send prompt: ' + e.toString())
	}
}
// getSyncState queries the API for the synchronization status of the node and
// sets the wallet's `synced` state.
function* getSyncStateSaga() {
	try {
		const response = yield sentientdCall('/consensus')
		yield put(actions.setSyncState(response.synced))
	} catch (e) {
		console.error('error fetching sync status: ' + e.toString())
	}
}

// showBackupPromptSaga handles a SHOW_BACKUP_PROMPT action, asynchronously
// fetching the primary seed from the sentient API and setting the backup prompt's
// state accordingly.
function *showBackupPromptSaga() {
	try {
		const response = yield sentientdCall('/wallet/seeds')
		yield put(actions.setPrimarySeed(response.primaryseed))
		if (response.allseeds.length > 1) {
			yield put(actions.setAuxSeeds(response.allseeds.slice(1)))
		}
	} catch (e) {
		console.error(`error fetching primary seed for backup prompt: ${e.toString()}`)
	}
}

// exported redux-saga action watchers
export function* dataFetcher() {
	while (true) {
		let tasks = []
		tasks = tasks.concat(yield fork(getSyncStateSaga))
		tasks = tasks.concat(yield fork(getLockStatusSaga))
		tasks = tasks.concat(yield fork(getBalanceSaga))
		tasks = tasks.concat(yield fork(getTransactionsSaga))
		yield join(...tasks)
		yield race({
			task: call(delay, 2000),
			cancel: take(constants.FETCH_DATA),
		})
	}
}
export function* watchStartSendView() {
	yield *takeEvery(constants.SHOW_SEND_VIEW, showSendViewSaga)
}
export function* watchCreateNewWallet() {
	yield* takeEvery(constants.CREATE_NEW_WALLET, createWalletSaga)
}
export function* watchInitNewWallet() {
	yield* takeEvery(constants.INIT_NEW_WALLET, initNewWalletSaga)
}
export function* watchRecoverSeedSaga() {
	yield* takeEvery(constants.RECOVER_SEED, recoverSeedSaga)
}
export function* watchGetLockStatus() {
	yield* takeEvery(constants.GET_LOCK_STATUS, getLockStatusSaga)
}
export function* watchUnlockWallet() {
	yield* takeEvery(constants.UNLOCK_WALLET, walletUnlockSaga)
}
export function* watchLockWallet() {
	yield* takeEvery(constants.LOCK_WALLET, walletLockSaga)
}
export function* watchGetBalance() {
	yield* takeEvery(constants.GET_BALANCE, getBalanceSaga)
}
export function* watchGetTransactions() {
	yield* takeEvery(constants.GET_TRANSACTIONS, getTransactionsSaga)
}
export function* watchShowTransactionListViewSaga() {
	yield* takeEvery(constants.SHOW_TRANSACTION_LIST_VIEW, showTransactionListViewSaga)
}
export function* watchShowReceiveViewSaga() {
	yield* takeEvery(constants.SHOW_RECEIVE_VIEW, showReceiveViewSaga)
}
export function* watchSendCurrency() {
	yield* takeEvery(constants.SEND_CURRENCY, sendCurrencySaga)
}
export function* watchGetSyncState() {
	yield* takeEvery(constants.GET_SYNCSTATE, getSyncStateSaga)
}
export function* watchChangePassword() {
	yield* takeEvery(constants.CHANGE_PASSWORD, changePasswordSaga)
}
export function* watchShowBackupPrompt() {
	yield *takeEvery(constants.SHOW_BACKUP_PROMPT, showBackupPromptSaga)
}
export function* watchGetNewReceiveAddress() {
	yield *takeEvery(constants.GET_NEW_RECEIVE_ADDRESS, getNewReceiveAddressSaga)
}
export function* watchSaveAddress() {
	yield *takeEvery(constants.SAVE_ADDRESS, saveAddressSaga)
}
export function* watchUpdateAddressDescription() {
	yield *takeEvery(constants.UPDATE_ADDRESS_DESCRIPTION, updateAddressDescriptionSaga)
}
