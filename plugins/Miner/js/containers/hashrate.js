import HashRateView from '../components/hashrate'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { changeChartType } from '../actions/miner.js'

const mapStateToProps = (state) => ({
    hashRate: state.miner.get('hashrate'),
    chartType: state.miner.get('charttype'),
    mining: state.miner.get('mining'),
})

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({ changeChartType }, dispatch),
})

const HashRate = connect(mapStateToProps, mapDispatchToProps)(HashRateView)
export default HashRate