import ReceiveViewView from '../components/receiveview.js'
import { connect } from 'react-redux'
import { hideReceiveView, setAddressDescription, getNewReceiveAddress, saveAddress } from '../actions/wallet.js'
import { bindActionCreators } from 'redux'

const mapStateToProps = (state) => ({
	address: state.receiveview.get('address'),
	addresses: state.receiveview.get('addresses'),
	description: state.receiveview.get('description'),
})
const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ hideReceiveView, getNewReceiveAddress, saveAddress, setAddressDescription}, dispatch),
})

const ReceiveView = connect(mapStateToProps, mapDispatchToProps)(ReceiveViewView)
export default ReceiveView
