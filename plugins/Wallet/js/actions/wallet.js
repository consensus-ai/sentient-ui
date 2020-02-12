import * as constants from '../constants/wallet.js'

export const getLockStatus = () => ({
	type: constants.GET_LOCK_STATUS,
})
export const setLocked = () => ({
	type: constants.SET_LOCKED,
})
export const setUnlocked = () => ({
	type: constants.SET_UNLOCKED,
})
export const setEncrypted = () => ({
	type: constants.SET_ENCRYPTED,
})
export const setUnencrypted = () => ({
	type: constants.SET_UNENCRYPTED,
})
export const dismissNewWalletDialog = () => ({
	type: constants.DISMISS_NEW_WALLET_DIALOG,
})
export const showNewWalletDialog = (password, seed) => ({
	type: constants.SHOW_NEW_WALLET_DIALOG,
	password,
	seed,
})
export const unlockWallet = (password) => ({
	type: constants.UNLOCK_WALLET,
	password,
})
export const createNewWallet = (password, seed) => ({
	type: constants.CREATE_NEW_WALLET,
	password,
	seed,
})
export const initNewWallet = (password, seed) => ({
	type: constants.INIT_NEW_WALLET,
	password,
	seed,
})
export const getBalance = () => ({
	type: constants.GET_BALANCE,
})
export const setBalance = (synced, confirmed, unconfirmed) => ({
	type: constants.SET_BALANCE,
	synced,
	confirmed,
	unconfirmed,
})
export const getTransactions = () => ({
	type: constants.GET_TRANSACTIONS,
})
export const setTransactions = (transactions) => ({
	type: constants.SET_TRANSACTIONS,
	transactions,
})
export const showSendView = () => ({
	type: constants.SHOW_SEND_VIEW,
})
export const closeSendView = () => ({
	type: constants.CLOSE_SEND_VIEW,
})
export const setSendAddress = (address) => ({
	type: constants.SET_SEND_ADDRESS,
	address,
})
export const setSendAmount = (amount) => ({
	type: constants.SET_SEND_AMOUNT,
	amount,
})
export const hideAllViews = () => ({
	type: constants.HIDE_ALL_VIEWS,
})
export const showTransactionListView = () => ({
	type: constants.SHOW_TRANSACTION_LIST_VIEW,
})
export const hideTransactionListView = () => ({
	type: constants.HIDE_TRANSACTION_LIST_VIEW,
})
export const showReceiveView = () => ({
	type: constants.SHOW_RECEIVE_VIEW,
})
export const hideReceiveView = () => ({
	type: constants.HIDE_RECEIVE_VIEW,
})
export const getNewReceiveAddress = () => ({
	type: constants.GET_NEW_RECEIVE_ADDRESS,
})
export const setReceiveAddress = (address) => ({
	type: constants.SET_RECEIVE_ADDRESS,
	address,
})
export const sendCurrency = (destination, amount, currencytype) => ({
	type: constants.SEND_CURRENCY,
	destination,
	amount,
	currencytype,
})
export const closePasswordPrompt = () => ({
	type: constants.CLOSE_PASSWORD_PROMPT,
})
export const handlePasswordChange = (password) => ({
	type: constants.HANDLE_PASSWORD_CHANGE,
	password,
})
export const lockWallet = () => ({
	type: constants.LOCK_WALLET,
})
export const showConfirmationDialog = () => ({
	type: constants.SHOW_CONFIRMATION_DIALOG,
})
export const hideConfirmationDialog = () => ({
	type: constants.HIDE_CONFIRMATION_DIALOG,
})
export const showMoreTransactions = (increment = 30) => ({
	type: constants.SHOW_MORE_TRANSACTIONS,
	increment,
})
export const getSyncState = () => ({
	type: constants.GET_SYNCSTATE,
})
export const setSyncState = (synced) => ({
	type: constants.SET_SYNCSTATE,
	synced,
})
export const showNewWalletForm = () => ({
	type: constants.SHOW_NEW_WALLET_FORM,
})
export const hideNewWalletForm = () => ({
	type: constants.HIDE_NEW_WALLET_FORM,
})
export const setUseCustomPassphrase = (useCustomPassphrase) => ({
	type: constants.SET_USE_CUSTOM_PASSPHRASE,
	useCustomPassphrase,
})
export const showSeedRecoveryDialog = () => ({
	type: constants.SHOW_SEED_RECOVERY_DIALOG,
})
export const hideSeedRecoveryDialog = () => ({
	type: constants.HIDE_SEED_RECOVERY_DIALOG,
})
export const recoverSeed = (seed) => ({
	type: constants.RECOVER_SEED,
	seed,
})
export const seedRecoveryStarted = () => ({
	type: constants.SEED_RECOVERY_STARTED,
})
export const seedRecoveryFinished = () => ({
	type: constants.SEED_RECOVERY_FINISHED,
})
export const showInitSeedForm = () => ({
	type: constants.SHOW_INIT_SEED_FORM,
})
export const hideInitSeedForm = () => ({
	type: constants.HIDE_INIT_SEED_FORM,
})
export const initSeedStarted = () => ({
	type: constants.SEED_INIT_STARTED,
})
export const initSeedFinished = () => ({
	type: constants.SEED_INIT_FINISHED,
})
export const setRescanning = (rescanning) => ({
	type: constants.SET_RESCANNING,
	rescanning,
})
export const setConfirmationError = (error) => ({
	type: constants.SET_CONFIRMATION_ERROR,
	error,
})
export const showChangePasswordDialog = () => ({
	type: constants.SHOW_CHANGE_PASSWORD_DIALOG,
})
export const hideChangePasswordDialog = () => ({
	type: constants.HIDE_CHANGE_PASSWORD_DIALOG,
})
export const changePassword = (currentpassword, newpassword) => ({
	type: constants.CHANGE_PASSWORD,
	currentpassword,
	newpassword,
})
export const setChangePasswordError = (error) => ({
	type: constants.SET_CHANGE_PASSWORD_ERROR,
	error,
})
export const toggleFilter = () => ({
	type: constants.TOGGLE_FILTER,
})
export const fetchData = () => ({
	type: constants.FETCH_DATA,
})
export const setFeeEstimate = (estimate) => ({
	type: constants.SET_FEE_ESTIMATE,
	estimate,
})
export const showBackupPrompt = () => ({
	type: constants.SHOW_BACKUP_PROMPT,
})
export const hideBackupPrompt = () => ({
	type: constants.HIDE_BACKUP_PROMPT,
})
export const setPrimarySeed = (primarySeed) => ({
	type: constants.SET_PRIMARY_SEED,
	primarySeed,
})
export const setAuxSeeds = (seeds) => ({
	type: constants.SET_AUX_SEEDS,
	seeds,
})
export const setSendError = (error) => ({
	type: constants.SET_SEND_ERROR,
	error,
})
export const saveAddress = (address) => ({
	type: constants.SAVE_ADDRESS,
	address,
})
export const updateAddressDescription = (address) => ({
	type: constants.UPDATE_ADDRESS_DESCRIPTION,
	address,
})
export const setReceiveAddresses = (addresses) => ({
	type: constants.SET_RECEIVE_ADDRESSES,
	addresses,
})
export const setAddressDescription = (description) => ({
	type: constants.SET_ADDRESS_DESCRIPTION,
	description,
})


export const setShowCreatePasswordView = (showCreatePasswordView) => ({
	type: constants.SHOW_CREATE_PASSWORD_VIEW,
	showCreatePasswordView,
})
export const setShowGenerateSeedView = (showGenerateSeedView) => ({
	type: constants.SHOW_GENERATE_SEED_VIEW,
	showGenerateSeedView,
})
export const setShowImportSeedView = (showImportSeedView) => ({
	type: constants.SHOW_IMPORT_SEED_VIEW,
	showImportSeedView,
})
export const setShowBackupSeedView = (showBackupSeedView, seed) => ({
	type: constants.SHOW_BACKUP_SEED_VIEW,
	showBackupSeedView,
	seed
})
export const setShowWalletInitializingView = (showWalletInitializingView) => ({
	type: constants.SHOW_WALLET_INITIALIZING_VIEW,
	showWalletInitializingView,
})

export const setPassword = (password) => ({
	type: constants.SET_PASSWORD,
	password,
})
export const setPasswordConfirmation = (passwordConfirmation) => ({
	type: constants.SET_PASSWORD_CONFIRMATION,
	passwordConfirmation,
})
export const setGenerateNewSeed = (generateNewSeed) => ({
	type: constants.SET_GENERATE_NEW_SEED,
	generateNewSeed,
})
export const setSeed = (seed) => ({
	type: constants.SET_SEED,
	seed,
})
export const setInitWalletError = (error) => ({
	type: constants.SET_INIT_WALLET_ERROR,
	error,
})
export const setConfirmSeedBackup = (confirmSeedBackup) => ({
	type: constants.SET_CONFIRM_SEED_BACKUP,
	confirmSeedBackup,
})
