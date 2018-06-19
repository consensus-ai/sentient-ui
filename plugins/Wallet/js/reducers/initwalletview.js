import { Map } from 'immutable'
import { SHOW_INIT_WALLET_VIEW, HIDE_INIT_WALLET_VIEW,
         SET_PASSWORD, SET_PASSWORD_CONFIRMATION,
         SET_GENERATE_NEW_SEED, SET_SEED, SET_INIT_WALLET_ERROR,
         SHOW_INIT_BACKUP_WALLET_VIEW, HIDE_INIT_BACKUP_WALLET_VIEW,
         SHOW_INITIALIZING_SEED_VIEW, HIDE_INITIALIZING_SEED_VIEW } from '../constants/wallet.js'

const initialState = Map({
  showinitwalletview: true,
  showinitbackupwalletview: false,
  showinitializingseedview: false,
  password: '',
  passwordconfirmation: '',
  generatenewseed: true,
  seed: '',
  initwalleterror: '',
})

export default function initwalletview(state = initialState, action) {
  switch (action.type) {
  case SHOW_INIT_WALLET_VIEW:
    return state.set('showinitwalletview', true)
  case HIDE_INIT_WALLET_VIEW:
    return state.set('showinitwalletview', false)
  case SHOW_INIT_BACKUP_WALLET_VIEW:
    return state.set('password', action.password)
                .set('seed', action.seed)
                .set('showinitbackupwalletview', true)
  case HIDE_INIT_BACKUP_WALLET_VIEW:
    return state.set('showinitbackupwalletview', false)
  case SHOW_INITIALIZING_SEED_VIEW:
    return state.set('showinitializingseedview', true)
  case HIDE_INITIALIZING_SEED_VIEW:
    return state.set('showinitializingseedview', false)
  case SET_PASSWORD:
    return state.set('password', action.password)
  case SET_PASSWORD_CONFIRMATION:
    return state.set('passwordconfirmation', action.passwordConfirmation)
  case SET_GENERATE_NEW_SEED:
    return state.set('generatenewseed', action.generateNewSeed)
  case SET_SEED:
    return state.set('seed', action.seed)
  case SET_INIT_WALLET_ERROR:
    return state.set('initwalleterror', action.error)
  default:
    return state
  }
}
