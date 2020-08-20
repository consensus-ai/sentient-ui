import UpgradeMessageView from '../components/upgradeMessage'
import { connect } from 'react-redux'

const mapStateToProps = (state) => ({
  status: state.topic.get('status'),
})

export default connect(mapStateToProps)(UpgradeMessageView)