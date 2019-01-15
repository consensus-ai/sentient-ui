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
  hashrateHistory
})

export const getDataForDisplay = (duration) => ({
  type: constants.GET_DATA_FOR_DISPLAY,
  duration,
})

export const setPoolStatsHistory = (poolHistory) => ({
  type: constants.SET_POOL_STATS_HISTORY,
  poolHistory
})

export const changeChartType = (chartType) => ({
  type: constants.CHANGE_CHART_TYPE,
  chartType
})

export const getHashrateHistory = (duration) => ({
  type: constants.GET_HASHRATE_HISTORY,
  duration,
})

export const getPoolStatsHistory = (duration) => ({
  type: constants.GET_POOL_STATS_HISTORY,
  duration,
})

export const updateSharesEfficiency = (sharesEfficiency) => ({
  type: constants.UPDATE_SHARES_EFFICIENCY,
  sharesEfficiency,
})

export const updateUnpaidBalance = (balance) => ({
  type: constants.UPDATE_UNPAID_BALANCE,
  balance,
})

export const updatePoolHashRate = (hashRate) => ({
  type: constants.UPDATE_POOL_HASH_RATE,
  hashRate,
})

export const setMiningType = (miningType) => ({
  type: constants.SET_MINING_TYPE,
  miningType,
})

export const setHashRate = (hashRate) => ({
  type: constants.UPDATE_HASH_RATE,
  hashRate
})

export const setCurrentHashrate = (hashRate, timestamp) => ({
  type: constants.UPDATE_CURRENT_HASH_RATE,
  hashRate,
  timestamp,
})

export const getCurrentHashrate = () => ({
  type: constants.GET_CURRENT_HASH_RATE
})

export const getHashRate = () => ({
  type: constants.GET_HASH_RATE
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
