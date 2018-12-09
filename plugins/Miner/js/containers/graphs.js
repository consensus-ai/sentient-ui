import GraphsView from '../components/graphs'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getHashrateHistory, getPoolStatsHistory } from '../actions/miner.js'

const mapStateToProps = (state) => ({
  chartType: state.miner.get('charttype'),
  hashrateHistory: state.miner.get('hashratehistory'),
  poolHistory: state.miner.get('poolhistory'),
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({ getHashrateHistory, getPoolStatsHistory }, dispatch),
})

const Graphs = connect(mapStateToProps, mapDispatchToProps)(GraphsView)
export default Graphs
