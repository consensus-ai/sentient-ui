import NewTopicView from '../components/newTopicForm.js'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { submitTopic } from '../actions/topic.js'

const mapStateToProps = (state) => ({
  walletUnlocked: state.topic.get('walletunlocked'),
})


const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({
    submitTopic,
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(NewTopicView)
