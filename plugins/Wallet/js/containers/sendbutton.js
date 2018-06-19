import SendButtonView from '../components/sendbutton.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { hideAllViews, showSendView } from '../actions/wallet.js'

const mapStateToProps = (state) => ({
  isActive: state.wallet.get('showSendView'),
  isLocked: !state.wallet.get('unlocked'),
})
const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({ hideAllViews, showSendView }, dispatch),
})

const SendButton = connect(mapStateToProps, mapDispatchToProps)(SendButtonView)
export default SendButton
