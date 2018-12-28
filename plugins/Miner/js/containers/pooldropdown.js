import PoolDropdownView from '../components/pooldropdown.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { changeMiningType, getMiningType, changeChartType } from '../actions/miner.js'

const mapStateToProps = (state) => ({
  miningType: state.miner.get('miningtype'),
  walletUnlocked: state.miner.get('walletunlocked'),
  mining: state.miner.get('mining'),
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({ changeMiningType, getMiningType, changeChartType }, dispatch),
})

const PoolDropdown = connect(mapStateToProps, mapDispatchToProps)(PoolDropdownView)
export default PoolDropdown
