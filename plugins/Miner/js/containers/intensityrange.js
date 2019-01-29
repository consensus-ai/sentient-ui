import IntensityRangeView from '../components/intensityrange'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { changeIntensity, getIntensity } from '../actions/miner.js'

const mapStateToProps = (state) => ({
    mining: state.miner.get('mining'),
    intensity: state.miner.get('intensity'),
})

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({ changeIntensity, getIntensity }, dispatch),
})

const IntensityRange = connect(mapStateToProps, mapDispatchToProps)(IntensityRangeView)
export default IntensityRange