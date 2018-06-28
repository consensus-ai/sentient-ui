import * as constants from '../constants/miner.js'

export const getLockStatus = () => ({
  type: constants.GET_LOCK_STATUS,
})

export const fetchData = () => ({
  type: constants.FETCH_DATA,
})

export const setWalletLocked = (walletLocked) => ({
  type: constants.SET_WALLET_LOCKED,
  walletLocked,
})

export const getMiningStatus = () => ({
  type: constants.GET_MINING_STATUS,
})

export const setMiningStatus = (miningStatus) => ({
  type: constants.SET_MINING_STATUS,
  miningStatus,
})

export const startMiner = () => ({
  type: constants.START_MINER,
})

export const stopMiner = () => ({
  type: constants.STOP_MINER,
})
