import * as constants from '../constants/topic.js'

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
