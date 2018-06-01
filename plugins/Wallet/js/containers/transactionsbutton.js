import TransactionsButtonView from '../components/transactionsbutton.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { hideAllViews, showTransactionListView } from '../actions/wallet.js'

const mapStateToProps = (state) => ({
  isActive: state.wallet.get('showTransactionListView'),
  isLocked: !state.wallet.get('unlocked'),
})
const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({ hideAllViews, showTransactionListView }, dispatch),
})

const TransactionsButton = connect(mapStateToProps, mapDispatchToProps)(TransactionsButtonView)
export default TransactionsButton
