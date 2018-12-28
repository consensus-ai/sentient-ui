import UnlockedWalletView from '../components/unlockedwallet.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { startMiner, stopMiner, changeChartType, getCurrentHashrate } from '../actions/miner.js'

const mapStateToProps = (state) => ({
  miningType: state.miner.get('miningtype'),
  walletUnlocked: state.miner.get('walletunlocked'),
  hashRate: state.miner.get('hashrate'),
  mining: state.miner.get('mining'),
  miningpid: state.miner.get('miningpid'),
  chartType: state.miner.get('charttype'),
  sharesEfficiency: state.miner.get('sharesefficiency'),
  balance: state.miner.get('balance'),
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({ startMiner, stopMiner, changeChartType, getCurrentHashrate }, dispatch),
})

const UnlockedWallet = connect(mapStateToProps, mapDispatchToProps)(UnlockedWalletView)
export default UnlockedWallet
