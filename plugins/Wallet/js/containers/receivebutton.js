import ReceiveButtonView from '../components/receivebutton.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { hideAllViews, showReceiveView } from '../actions/wallet.js'

const mapStateToProps = (state) => ({
  isActive: state.wallet.get('showReceiveView'),
  isLocked: !state.wallet.get('unlocked'),
})
const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ hideAllViews, showReceiveView }, dispatch),
})

const ReceiveButton = connect(mapStateToProps, mapDispatchToProps)(ReceiveButtonView)
export default ReceiveButton
