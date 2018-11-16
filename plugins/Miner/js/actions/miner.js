import * as constants from '../constants/miner.js'

export const getLockStatus = () => ({
  type: constants.GET_WALLET_BALANCE,
})

export const fetchData = () => ({
  type: constants.FETCH_DATA,
})

export const setWalletBalance = (confirmedBalance, walletUnlocked) => ({
  type: constants.SET_WALLET_BALANCE,
  confirmedBalance,
  walletUnlocked,
})

export const getMiningStatus = () => ({
  type: constants.GET_MINING_STATUS,
})

export const setMiningStatus = (miningStatus) => ({
  type: constants.SET_MINING_STATUS,
  miningStatus,
})

export const setMiningType = (miningType) => ({
  type: constants.SET_MINING_TYPE,
  miningType,
})

export const getMiningType = () => ({
  type: constants.GET_MINING_TYPE,
})

export const changeMiningType = (miningType) => ({
  type: constants.CHANGE_MINING_TYPE,
  miningType
})

export const startMiner = () => ({
  type: constants.START_MINER,
})

export const stopMiner = () => ({
  type: constants.STOP_MINER,
})
