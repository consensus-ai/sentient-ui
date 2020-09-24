import { Map } from 'immutable'
import * as constants from '../constants/topic.js'

const initialState = Map({
  walletunlocked: true,
  confirmedbalance: '0',
  unconfirmedbalance: '0',
  topictype: 'opentopicids',
  topics: [],
  topicid: '0',
  height: 0,
  status: {
    proposal: {},
    status: {},
  },
})

export default function minerReducer(state = initialState, action) {
  switch (action.type) {
  case constants.SET_WALLET_BALANCE:
    return state
      .set('walletunlocked', action.walletUnlocked)
      .set('confirmedbalance', action.confirmedBalance)
      .set('unconfirmedbalance', action.unconfirmedBalance)
      .set('height', action.height)
  case constants.CHANGE_TOPIC_TYPE:
    return state.set('topictype', action.topicType)
  case constants.SET_TOPICS:
    return state.set('topics', action.topics)
  case constants.TOPIC_SUBMITTED:
    return state.set('topicid', action.topicId)
  case constants.SET_CONSENSUS_STATUS:
    return state.set('status', action.status)
  default:
    return state
  }
}
