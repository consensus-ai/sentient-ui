import { Map, List } from 'immutable'
import * as constants from '../constants/miner.js'
import * as errors from '../constants/error.js'

const initialState = Map({
  walletlocked: true,
  miningstatus: {},
})

export default function minerReducer(state = initialState, action) {
  switch (action.type) {
  case constants.SET_WALLET_LOCKED:
    return state.set('walletlocked', action.walletLocked)
  case constants.SET_MINING_STATUS:
    return state.set('miningstatus', action.miningStatus)
  default:
    return state
  }
}
