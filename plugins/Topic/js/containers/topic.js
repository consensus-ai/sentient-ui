import TopicView from '../components/topic.js'
import { connect } from 'react-redux'

const mapStateToProps = (state) => ({
  confirmedBalance: state.topic.get('confirmedbalance'),
  walletUnlocked: state.topic.get('walletunlocked'),
})

export default connect(mapStateToProps)(TopicView)
