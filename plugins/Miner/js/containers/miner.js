import MinerView from '../components/miner.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { startMiner, stopMiner } from '../actions/miner.js'

const mapStateToProps = (state) => ({
  synced: state.miner.get('synced'),
  confirmedBalance: state.miner.get('confirmedbalance'),
  walletLocked: state.miner.get('walletlocked'),
  miningStatus: state.miner.get('miningstatus'),
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({ startMiner, stopMiner }, dispatch),
})

const Miner = connect(mapStateToProps, mapDispatchToProps)(MinerView)
export default Miner
