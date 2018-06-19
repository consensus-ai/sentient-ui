import WalletView from '../components/wallet.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { showSendView } from '../actions/wallet.js'

const mapStateToProps = (state) => ({
	senfundbalance: state.wallet.get('senfundbalance'),
  showTransactionListView: state.wallet.get('showTransactionListView'),
	showReceiveView: state.wallet.get('showReceiveView'),
	showSendView: state.wallet.get('showSendView'),
	showNewWalletDialog: state.wallet.get('showNewWalletDialog'),
	showRecoveryDialog: state.wallet.get('showRecoveryDialog'),
	showChangePasswordDialog: state.wallet.get('showChangePasswordDialog'),
	showBackupPrompt: state.wallet.get('showBackupPrompt'),
  unlocked: state.wallet.get('unlocked'),
})
const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ showSendView }, dispatch),
})

const Wallet = connect(mapStateToProps, mapDispatchToProps)(WalletView)
export default Wallet
