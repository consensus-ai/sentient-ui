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

export const setMiningStatus = (miningStatus, miningPid) => ({
  type: constants.SET_MINING_STATUS,
  miningStatus,
  miningPid,
})

export const setHashrateHistory = (hashrateHistory) => ({
  type: constants.SET_HASHRATE_HISTORY,
  hashrateHistory,
})

export const getHashrateHistory = (duration) => ({
  type: constants.GET_HASHRATE_HISTORY,
  duration,
})

export const updatePoolStats = (sharesEfficiency, balance) => ({
  type: constants.UPDATE_POOL_STATS,
  sharesEfficiency,
  balance,
})

export const setMiningType = (miningType) => ({
  type: constants.SET_MINING_TYPE,
  miningType,
})

export const setHashRate = (hashRate) => ({
  type: constants.UPDATE_MINING_HASH_RATE,
  hashRate,
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

export const stopMiner = (pid) => ({
  type: constants.STOP_MINER,
  pid,
})
