import GraphsView from '../components/graphs'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getHashrateHistory, getPoolStatsHistory, getDataForDisplay } from '../actions/miner.js'

const mapStateToProps = (state) => ({
  chartType: state.miner.get('charttype'),
  miningType: state.miner.get('miningtype'),
  hashrateHistory: state.miner.get('hashratehistory'),
  poolHistory: state.miner.get('poolhistory'),
  currentHashrate: state.miner.get('currenthashrate'),
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({ getHashrateHistory, getPoolStatsHistory, getDataForDisplay }, dispatch),
})

const Graphs = connect(mapStateToProps, mapDispatchToProps)(GraphsView)
export default Graphs
