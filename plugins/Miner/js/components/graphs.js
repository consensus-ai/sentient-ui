import PropTypes from 'prop-types'
import React from 'react'

import HashRateGraph from './hashrategraph'
import PoolStatsGraph from './poolstatsgraph'
import CurrentHashRateGraph from './currenthashrategraph'

const updatingDataForDisplayInterval = 60 * 10 * 1000 // 10 minutes

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
    const { actions } = this.props
    actions.getDataForDisplay(this.state.durations[this.state.selectedDuration])
    this.interval = setInterval(() => {
      actions.getDataForDisplay(this.state.durations[this.state.selectedDuration])
    }, updatingDataForDisplayInterval)
  }

  componentDidUpdate(nextProps) {
    if (nextProps.chartType !== this.props.chartType) {
      this.changeDuration(this.state.selectedDuration)
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  changeDuration (label) {
    const { actions, chartType } = this.props
    const duration = this.state.durations[label]
    this.setState((prevState) => {
      if (prevState.selectedDuration !== label){
        return { selectedDuration: label }
      }
    })
    if (chartType === 'hashrate') {
      actions.getHashrateHistory(duration)
    } else {
      actions.getPoolStatsHistory(duration)
    }
  }

  render () {
    const { chartType, poolHistory, currentHashrate, hashrateHistory, miningType } = this.props
    const { durations, selectedDuration } = this.state

    return (
      <div className="graph">
        { chartType === 'hashrate' && miningType === 'local' && <CurrentHashRateGraph currentHashrate={currentHashrate} /> }
        { chartType === 'hashrate' && miningType !== 'local' && <HashRateGraph hashrateHistory={hashrateHistory} /> }
        { chartType === 'shares' && miningType !== 'local' && <PoolStatsGraph poolHistory={poolHistory} /> }
        <div className="footer">
          { chartType === 'shares' && miningType !== 'local' && <span>Shares this session</span> }
          { chartType === 'hashrate' && miningType !== 'local' && <span>Avarage {this.state.selectedDuration} hash rate</span> }
          { chartType === 'hashrate' && miningType === 'local' && <span>Average last 4 hours hash rate</span> }
          { miningType !== 'local' && (
            <ul>
                {Object.keys(durations).map((label) => {
                  return <li
                    key={label}
                    onClick={() => this.changeDuration(label)}
                    className={label === selectedDuration ? "active" : ""}>{label}
                  </li>
                })}
            </ul>
          )}
        </div>
      </div>
    )
  }
}

Graphs.propTypes = {
  poolHistory: PropTypes.array.isRequired,
  hashrateHistory: PropTypes.array.isRequired,
  chartType: PropTypes.string.isRequired,
  miningType: PropTypes.string.isRequired,
  currentHashrate: PropTypes.array.isRequired,
}

export default Graphs