import PropTypes from 'prop-types'
import React from 'react'

import HashRateGraph from './hashrategraph'
import PoolStatsGraph from './poolstatsgraph'
import CurrentHashRateGraph from './currenthashrategraph'

const dataUpdateInterval = 300000 // 5 minutes

class Graphs extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedDuration: '1 Day',
      durations: {
        'Current': 0,
        '1 Day': 86400, // 24 * 60 * 60
        '1 Week': 604800,  // 7 * 24 * 60 * 60
        '1 Month': 2592000 // 30 * 24 * 60 * 60
      }
    }
  }

  componentDidMount () {
    const { actions } = this.props
    actions.getDataForDisplay(this.state.durations[this.state.selectedDuration])
    this.dataInterval = setInterval(() => {
      actions.getDataForDisplay(this.state.durations[this.state.selectedDuration])
    }, dataUpdateInterval)
  }

  componentDidUpdate(prevProps) {
    const { chartType, mining } =  this.props
    if (prevProps.chartType !== chartType) {
      let { selectedDuration } = this.state
      if (selectedDuration === 'Current' && chartType === 'shares') {
        selectedDuration = '1 Day'
      }
      this.changeDuration(selectedDuration)
    }
    if (mining && !prevProps.mining) {
      this.changeDuration('Current')
    }
  }

  componentWillUnmount() {
    clearInterval(this.dataInterval)
  }

  changeDuration (label) {
    const { actions, chartType } = this.props
    const duration = this.state.durations[label]
    this.setState((prevState) => {
      if (prevState.selectedDuration !== label){
        return { selectedDuration: label }
      }
    })
    if (label === 'Current') {
      if (chartType === 'shares') {
        actions.changeChartType('hashrate')
      }
    } else {
      if (chartType === 'hashrate') {
        actions.getHashrateHistory(duration)
      } else {
        actions.getPoolStatsHistory(duration)
      }
    }
  }

  render () {
    const { chartType, poolHistory, currentHashrate, mining, miningType, hashrateHistory } = this.props
    const { durations, selectedDuration } = this.state

    return (
      <div className="graph">
        { chartType === 'hashrate' && miningType === 'local' && (
          <CurrentHashRateGraph currentHashrate={currentHashrate} offset={4 * 60 * 60} interval={60} mining={mining} />
        )}
        { chartType === 'hashrate' && miningType !== 'local' && (selectedDuration === 'Current' ? (
          <CurrentHashRateGraph currentHashrate={currentHashrate} offset={60 * 60} interval={10} mining={mining}/>
        ) : (
          <HashRateGraph hashrateHistory={hashrateHistory} mining={mining} />
        ))}
        { chartType === 'shares' && miningType !== 'local' && (
          <PoolStatsGraph poolHistory={poolHistory} mining={mining} />
        )}
        <div className="footer">
          { chartType === 'shares' && miningType !== 'local' && <span>{`${selectedDuration} Shares`}</span> }
          { chartType === 'hashrate' && miningType !== 'local' && <span>{`${selectedDuration} Average Hash Rate`}</span> }
          { chartType === 'hashrate' && miningType === 'local' && <span>Last 4 Hours Average Hash Rate</span> }
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