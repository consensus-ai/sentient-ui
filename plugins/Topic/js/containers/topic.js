import TopicView from '../components/topic.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { getTopics, changeTopicType } from '../actions/topic.js'

const mapStateToProps = (state) => ({
  confirmedBalance: state.topic.get('confirmedbalance'),
  walletUnlocked: state.topic.get('walletunlocked'),
  unconfirmedBalance: state.topic.get('unconfirmedbalance'),
  topicType: state.topic.get('topictype'),
  topicId: state.topic.get('topicid'),
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({
    getTopics, changeTopicType,
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(TopicView)
