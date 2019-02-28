import UnpaidBalanceView from '../components/unpaidbalance'
import { connect } from 'react-redux'

const mapStateToProps = (state) => ({
  miningType: state.miner.get('miningtype'),
  balance: state.miner.get('balance'),
})

const UnpaidBalance = connect(mapStateToProps)(UnpaidBalanceView)
export default UnpaidBalance
