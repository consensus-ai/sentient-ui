import MinerView from '../components/miner.js'
import { connect } from 'react-redux'

const mapStateToProps = (state) => ({
  confirmedBalance: state.miner.get('confirmedbalance'),
  walletUnlocked: state.miner.get('walletunlocked'),
})

const Miner = connect(mapStateToProps)(MinerView)

export default Miner
