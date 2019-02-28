import PoolHashRateView from '../components/poolhashrate'
import { connect } from 'react-redux'

const mapStateToProps = (state) => ({
  miningType: state.miner.get('miningtype'),
  poolHashRate: state.miner.get('poolhashrate'),
})

const PoolHashRate = connect(mapStateToProps)(PoolHashRateView)
export default PoolHashRate
