import UnlockedWalletView from '../components/unlockedwallet.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { startMiner, stopMiner, getHashrateHistory } from '../actions/miner.js'

const mapStateToProps = (state) => ({
  miningType: state.miner.get('miningtype'),
  walletUnlocked: state.miner.get('walletunlocked'),
  miningStatus: state.miner.get('miningstatus'),
  hashRate: state.miner.get('hashrate'),
  mining: state.miner.get('mining'),
  miningpid: state.miner.get('miningpid'),
  chartData: state.miner.get('chartdata'),
  sharesEfficiency: state.miner.get('sharesefficiency'),
  balance: state.miner.get('balance'),
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({ startMiner, stopMiner, getHashrateHistory }, dispatch),
})

const UnlockedWallet = connect(mapStateToProps, mapDispatchToProps)(UnlockedWalletView)
export default UnlockedWallet
