import HeaderView from '../components/header.js'
import { connect } from 'react-redux'

const mapStateToProps = (state) => ({
  confirmedBalance: state.topic.get('confirmedbalance'),
  unconfirmedBalance: state.topic.get('unconfirmedbalance'),
})

export default connect(mapStateToProps)(HeaderView)