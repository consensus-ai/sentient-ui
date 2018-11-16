import { Map } from 'immutable'
import * as constants from '../constants/miner.js'
import * as errors from '../constants/error.js'

const initialState = Map({
  walletunlocked: true,
  miningstatus: {},
  confirmedbalance: '0',
  miningtype: 'pool'
})

export default function minerReducer(state = initialState, action) {
  switch (action.type) {
  case constants.SET_WALLET_BALANCE:
    return state
      .set('walletunlocked', action.walletUnlocked)
      .set('confirmedbalance', action.confirmedBalance)
  case constants.SET_MINING_STATUS:
    return state.set('miningstatus', action.miningStatus)
  case constants.SET_MINING_TYPE:
    return state.set('miningtype', action.miningType)
  default:
    return state
  }
}
