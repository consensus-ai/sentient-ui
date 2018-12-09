import PropTypes from 'prop-types'
import React from 'react'

import HashRateGraph from './hashrategraph'
import PoolStatsGraph from './poolstatsgraph'

class Graphs extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedDuration: '24 hours',
      durations: {
        '24 hours': 86400, // 24 * 60 * 60
        '3 days': 259200,  // 3 * 24 * 60 * 60
        '1 week': 604800,  // 7 * 24 * 60 * 60
        '1 month': 2592000 // 30 * 24 * 60 * 60
      }
    }
  }

  componentDidMount () {
    this.changeDuration ('24 hours')
  }

  changeDuration (label) {
    const { actions } = this.props
    const duration = this.state.durations[label]
    actions.getHashrateHistory(duration)
    actions.getPoolStatsHistory(duration)
    this.setState((prevState) => {
      if (prevState.selectedDuration !== label){
        return { selectedDuration: label }
      }
    })
  }

  render () {
    const { chartType, hashrateHistory, poolHistory } = this.props
    const { durations, selectedDuration } = this.state

    return (
      <div className="graph">
        { chartType == 'hashrate' && <HashRateGraph hashrateHistory={hashrateHistory} /> }
        { chartType == 'shares' && <PoolStatsGraph poolHistory={poolHistory} /> }
        <div className="footer">
          {chartType == 'shares' && <span>Shares this session</span>}
          {chartType == 'hashrate' && <span>Avarage {this.state.selectedDuration} hash rate</span>}
          {chartType == 'blocks' && <span>Shares this session</span>}
          <ul>
              {Object.keys(durations).map((label) => {
                return <li
                  key={label}
                  onClick={() => this.changeDuration(label)}
                  className={label == selectedDuration ? "active" : ""}>{label}
                </li>
              })}
          </ul>
        </div>
      </div>
    )
  }
}

Graphs.propTypes = {
  poolHistory: PropTypes.array.isRequired,
  hashrateHistory: PropTypes.array.isRequired,
}

export default Graphs