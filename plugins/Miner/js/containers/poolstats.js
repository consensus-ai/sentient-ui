import PoolStatsView from '../components/poolstats'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { changeChartType } from '../actions/miner.js'

const mapStateToProps = (state) => ({
    sharesEfficiency: state.miner.get('sharesefficiency'),
    chartType: state.miner.get('charttype'),
    mining: state.miner.get('mining'),
    miningType: state.miner.get('miningtype'),
})

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({ changeChartType }, dispatch),
})

const PoolStats = connect(mapStateToProps, mapDispatchToProps)(PoolStatsView)
export default PoolStats