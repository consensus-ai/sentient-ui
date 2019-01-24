import UnlockedWalletView from '../components/unlockedwallet.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { startMiner, stopMiner, changeChartType, getCurrentHashrate, getHashRate } from '../actions/miner.js'

const mapStateToProps = (state) => ({
  miningType: state.miner.get('miningtype'),
  walletUnlocked: state.miner.get('walletunlocked'),
  hashRate: state.miner.get('hashrate'),
  mining: state.miner.get('mining'),
  miningpid: state.miner.get('miningpid'),
  chartType: state.miner.get('charttype'),
  sharesEfficiency: state.miner.get('sharesefficiency'),
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({ startMiner, stopMiner, changeChartType, getCurrentHashrate, getHashRate }, dispatch),
})

const UnlockedWallet = connect(mapStateToProps, mapDispatchToProps)(UnlockedWalletView)
export default UnlockedWallet
