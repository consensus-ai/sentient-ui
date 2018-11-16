import MinerView from '../components/miner.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { startMiner, stopMiner } from '../actions/miner.js'

const mapStateToProps = (state) => ({
  confirmedBalance: state.miner.get('confirmedbalance'),
  walletUnlocked: state.miner.get('walletunlocked'),
  miningStatus: state.miner.get('miningstatus'),
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({ startMiner, stopMiner }, dispatch),
})

const Miner = connect(mapStateToProps, mapDispatchToProps)(MinerView)
export default Miner
