import SendViewView from '../components/sendview.js'
import { setSendError, setSendAddress, setSendAmount, closeSendView, sendCurrency } from '../actions/wallet.js'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

const mapStateToProps = (state) => ({
	sendAddress: state.sendview.get('sendaddress'),
	sendAmount: state.sendview.get('sendamount'),
	currencytype: state.sendview.get('currencytype'),
	feeEstimate: state.sendview.get('feeEstimate'),
	sendError: state.sendview.get('error'),
})
const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ closeSendView, setSendError, setSendAddress, setSendAmount, sendCurrency }, dispatch),
})

const SendView = connect(mapStateToProps, mapDispatchToProps)(SendViewView)
export default SendView
