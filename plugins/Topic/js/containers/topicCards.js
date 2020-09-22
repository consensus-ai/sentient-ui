import TopicCardsView from '../components/topicCards'
import { connect } from 'react-redux'

const mapStateToProps = (state) => ({
  topics: state.topic.get('topics'),
  height: state.topic.get('height'),
})

export default connect(mapStateToProps)(TopicCardsView)