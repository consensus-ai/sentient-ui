import { Map } from 'immutable'
import * as constants from '../constants/miner.js'
import * as errors from '../constants/error.js'
import { start } from 'repl';

const initialState = Map({
  walletunlocked: true,
  confirmedbalance: '0',
  miningtype: 'pool',
  hashrate: '0',
  mining: false,
  miningpid: null,
  chartdata: [],
  sharesefficiency: {},
  balance: {},
})

export default function minerReducer(state = initialState, action) {
  switch (action.type) {
  case constants.SET_WALLET_BALANCE:
    return state
      .set('walletunlocked', action.walletUnlocked)
      .set('confirmedbalance', action.confirmedBalance)
  case constants.SET_MINING_STATUS:
    return state
      .set('mining', action.miningStatus)
      .set('miningpid', action.miningPid)
      .set('hashrate', '0')
  case constants.SET_MINING_TYPE:
    return state.set('miningtype', action.miningType)
  case constants.UPDATE_MINING_HASH_RATE:
    const hastRate = parseFloat(action.hashRate).toFixed(2)
    const timestamp = Math.floor(Date.now() / 1000)
    if ((timestamp / 5) % 1 === 0) {
      return state
        .set('hashrate', hastRate)
        .set('chartdata', [...state.get('chartdata'), {hashrate: hastRate, time: timestamp}])
    } else {
      return state.set('hashrate', hastRate)
    }
  case constants.SET_HASHRATE_HISTORY:
    return state.set('chartdata', action.hashrateHistory)
  case constants.UPDATE_POOL_STATS:
    return state
      .set('sharesefficiency', action.sharesEfficiency)
      .set('balance', action.balance)
  default:
    return state
  }
}
