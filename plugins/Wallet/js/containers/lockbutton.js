import LockButtonView from '../components/lockbutton.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { hideAllViews, lockWallet } from '../actions/wallet.js'

const mapStateToProps = (state) => ({
  isActive: !state.wallet.get('unlocked'),
})

const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ hideAllViews, lockWallet }, dispatch),
})

const LockButton = connect(mapStateToProps, mapDispatchToProps)(LockButtonView)
export default LockButton
