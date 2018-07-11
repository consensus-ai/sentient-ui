import { Map } from 'immutable'
import { SHOW_CREATE_PASSWORD_VIEW, SHOW_GENERATE_SEED_VIEW,
         SHOW_IMPORT_SEED_VIEW, SHOW_BACKUP_SEED_VIEW, SHOW_WALLET_INITIALIZING_VIEW,
         SET_PASSWORD, SET_PASSWORD_CONFIRMATION,
         SET_GENERATE_NEW_SEED, SET_SEED, SET_INIT_WALLET_ERROR,
         SET_CONFIRM_SEED_BACKUP } from '../constants/wallet.js'

const initialState = Map({
  showcreatepasswordview: true,
  showgenerateseedview: false,
  showimportseedview: false,
  showbackupseedview: false,
  showwalletinitializingview: false,

  password: '',
  passwordconfirmation: '',
  generatenewseed: true,
  seed: '',
  confirmseedbackup: false,
  initwalleterror: '',
})

export default function initwalletview(state = initialState, action) {
  switch (action.type) {
  case SHOW_CREATE_PASSWORD_VIEW:
    return state.set('showcreatepasswordview', action.showCreatePasswordView)
  case SHOW_GENERATE_SEED_VIEW:
    return state.set('showgenerateseedview', action.showGenerateSeedView)
  case SHOW_IMPORT_SEED_VIEW:
    return state.set('showimportseedview', action.showImportSeedView)
  case SHOW_BACKUP_SEED_VIEW:
    return state.set('showbackupseedview', action.showBackupSeedView)
                .set('seed', action.seed)
  case SHOW_WALLET_INITIALIZING_VIEW:
    return state.set('showwalletinitializingview', action.showWalletInitializingView)
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
  case SET_CONFIRM_SEED_BACKUP:
    return state.set('confirmseedbackup', action.confirmSeedBackup)
  default:
    return state
  }
}
