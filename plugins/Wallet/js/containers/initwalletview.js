import InitWalletView from '../components/initwalletview.js'
import { initNewWallet, setPassword, setPasswordConfirmation, setGenerateNewSeed, setSeed, setInitWalletError, hideInitBackupWalletView, setConfirmSeedBackup } from '../actions/wallet.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

const mapStateToProps = (state) => ({
  showInitWalletView: state.initwalletview.get('showinitwalletview'),
  showInitBackupWalletView: state.initwalletview.get('showinitbackupwalletview'),
  showInitSeedView: state.initwalletview.get('showinitializingseedview'),
  password: state.initwalletview.get('password'),
  passwordConfirmation: state.initwalletview.get('passwordconfirmation'),
  generateNewSeed: state.initwalletview.get('generatenewseed'),
  seed: state.initwalletview.get('seed'),
  confirmSeedBackup: state.initwalletview.get('confirmseedbackup'),
  error: state.initwalletview.get('initwalleterror'),
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({initNewWallet, setPassword, setPasswordConfirmation, setGenerateNewSeed, setSeed, setInitWalletError, hideInitBackupWalletView, setConfirmSeedBackup}, dispatch),
})

const InitWallet = connect(mapStateToProps, mapDispatchToProps)(InitWalletView)
export default InitWallet
