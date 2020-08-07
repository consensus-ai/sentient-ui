import { Map } from 'immutable'
import * as constants from '../constants/topic.js'

const initialState = Map({
  walletunlocked: true,
  confirmedbalance: '0',
})

export default function minerReducer(state = initialState, action) {
  switch (action.type) {
  case constants.SET_WALLET_BALANCE:
    return state
      .set('walletunlocked', action.walletUnlocked)
      .set('confirmedbalance', action.confirmedBalance)
  default:
    return state
  }
}
