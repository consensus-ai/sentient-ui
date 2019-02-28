import UnlockedWalletView from '../components/unlockedwallet.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { startMiner, stopMiner, changeChartType, getCurrentHashrate, getHashRate } from '../actions/miner.js'

const mapStateToProps = (state) => ({
  miningType: state.miner.get('miningtype'),
  mining: state.miner.get('mining'),
  miningpid: state.miner.get('miningpid'),
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({ startMiner, stopMiner, changeChartType, getCurrentHashrate, getHashRate }, dispatch),
})

const UnlockedWallet = connect(mapStateToProps, mapDispatchToProps)(UnlockedWalletView)
export default UnlockedWallet
