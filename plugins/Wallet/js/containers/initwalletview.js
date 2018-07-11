import InitWalletView from '../components/initwalletview.js'
import { initNewWallet, setPassword, setPasswordConfirmation, setSeed, setInitWalletError,
         setShowCreatePasswordView, setShowGenerateSeedView, setShowImportSeedView, setShowBackupSeedView, setShowWalletInitializingView } from '../actions/wallet.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

const mapStateToProps = (state) => ({
  showCreatePasswordView: state.initwalletview.get('showcreatepasswordview'),
  showGenerateSeedView: state.initwalletview.get('showgenerateseedview'),
  showImportSeedView: state.initwalletview.get('showimportseedview'),
  showBackupSeedView: state.initwalletview.get('showbackupseedview'),
  showWalletInitializingView: state.initwalletview.get('showwalletinitializingview'),

  password: state.initwalletview.get('password'),
  passwordConfirmation: state.initwalletview.get('passwordconfirmation'),
  generateNewSeed: state.initwalletview.get('generatenewseed'),
  seed: state.initwalletview.get('seed'),
  confirmSeedBackup: state.initwalletview.get('confirmseedbackup'),
  error: state.initwalletview.get('initwalleterror'),
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    {
      initNewWallet, setPassword, setPasswordConfirmation, setSeed, setInitWalletError,
      setShowCreatePasswordView, setShowGenerateSeedView, setShowImportSeedView, setShowBackupSeedView, setShowWalletInitializingView
    },
    dispatch
  ),
})

const InitWallet = connect(mapStateToProps, mapDispatchToProps)(InitWalletView)
export default InitWallet
