import PropTypes from 'prop-types'
import React from 'react'
import PoolDropdown from '../containers/pooldropdown'
import BlankStats from './blankstats'
import BlankGrapf from './blankgraph'
import Chart from './chart'

class UnlockedWallet extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            chartType: 'hashrate',
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
        actions.getHashrateHistory(86400)
    }

    getHashRateForDisplay () {
        const { hashRate } = this.props
        return parseFloat(hashRate).toFixed(2) + " MH/s"
    }

    getAcceptedSharesEfficiency () {
        const { sharesEfficiency } = this.props
        if (!sharesEfficiency) return 0
        const { accepted, submitted } = sharesEfficiency
        return submitted && (accepted * 100 / submitted).toFixed(2) || 0
    }

    changeChartType (type) {
        this.setState({ chartType: type })
    }

    changeDuration (label) {
        const { actions } = this.props
        actions.getHashrateHistory(this.state.durations[label])
        this.setState({ selectedDuration: label })
    }

    miningActionOnClick ()  {
        const { mining, actions, miningpid } = this.props
        if (mining) {
            actions.stopMiner(miningpid)
        } else {
            actions.startMiner()
        }
    }

    render () {
        const { miningType, mining, chartData, balance } = this.props
        const { chartType, selectedDuration, durations } = this.state
        const accepted = this.getAcceptedSharesEfficiency()
        const rejected = accepted && (100 - accepted).toFixed(2) || 0

        return(
            <div className="content space-between">
                <div className="top-row">
                    <PoolDropdown />
                    <div className={`button miner-button ${mining ? "stop" : "start"}-button`} onClick={() => this.miningActionOnClick()}>
                        <div className="button-icon"></div>
                        <span>{mining ?  "Stop miner" : "Start miner" }</span>
                    </div>
                </div>
                {!mining && <BlankStats />}
                { mining &&
                    <div className="data-cards">
                        <div className="item" disabled={chartType != 'hashrate' ? 'disabled' : '' } onClick={()=> this.changeChartType('hashrate')}>
                            <b>{this.getHashRateForDisplay()}</b>
                            <small></small>
                            <span>Current hash rate</span></div>
                        <div className="item" hidden></div>
                        {miningType == 'pool' &&
                            <div className="item" disabled={chartType != 'shares' ? 'disabled' : '' } onClick={()=> this.changeChartType('shares')}>
                                <b>{accepted}%</b>
                                <small className="red">{rejected}% rejected</small>
                                <span>Shares Efficiency</span>
                            </div>
                        }
                        {miningType == 'local' &&
                            <div className="item" disabled={chartType != 'blocks' ? 'disabled' : '' } onClick={()=> this.changeChartType('blocks')}>
                                <b>1</b>
                                <small></small>
                                <span>Blocks Found</span>
                            </div>
                        }
                        <div className="item" disabled>
                            <div className="balance"><i className="fa fa-info-circle"></i>
                                <div className="info">Pool Minimum payout: 10 SEN</div>
                            </div>
                            <b>{balance && balance.unpaid || 0} SEN</b>
                            <small></small>
                            <span>Unpaid balance</span></div>
                    </div>
                }
                <div className="graph" ref={(el) => { this.graphRef = el }}>
                    <Chart graphRef={this.graphRef} chartData={chartData} />
                    <div className="footer">
                        {chartType == 'shares' && <span>Shares this session</span>}
                        {chartType == 'hashrate' && <span>Avarage hourly hash rate</span>}
                        {chartType == 'blocks' && <span>Shares this session</span>}
                        <ul>
                            {
                                Object.keys(durations).map((label) => {
                                    return <li
                                            key={label}
                                            onClick={() => this.changeDuration(label)}
                                            className={label == selectedDuration ? "active" : ""}>{label}</li>
                                })
                            }
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}

UnlockedWallet.propTypes = {
    walletUnlocked: PropTypes.bool.isRequired,
    mining: PropTypes.bool.isRequired,
}

export default UnlockedWallet