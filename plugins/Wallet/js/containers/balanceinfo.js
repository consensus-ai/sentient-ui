import BalanceInfoView from '../components/balanceinfo.js'
import { connect } from 'react-redux'

const mapStateToProps = (state) => ({
	synced: state.wallet.get('synced'),
	confirmedbalance: state.wallet.get('confirmedbalance'),
	unconfirmedbalance: state.wallet.get('unconfirmedbalance'),
	senfundbalance: state.wallet.get('senfundbalance'),
	senclaimbalance: state.wallet.get('senclaimbalance'),
})
const mapDispatchToProps = () => ({
})

const BalanceInfo = connect(mapStateToProps, mapDispatchToProps)(BalanceInfoView)
export default BalanceInfo
