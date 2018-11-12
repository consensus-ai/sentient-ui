import { Map, List } from 'immutable'
import * as constants from '../constants/miner.js'
import * as errors from '../constants/error.js'

const initialState = Map({
  synced: false,
  walletlocked: true,
  miningstatus: {},
  confirmedbalance: '0',
})

export default function minerReducer(state = initialState, action) {
  switch (action.type) {
  case constants.SET_WALLET_BALANCE:
    return state
      .set('synced', action.synced)
      .set('walletlocked', action.walletLocked)
      .set('confirmedbalance', action.confirmedBalance)
  case constants.SET_MINING_STATUS:
    return state.set('miningstatus', action.miningStatus)
  default:
    return state
  }
}
