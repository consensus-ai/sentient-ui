import PropTypes from 'prop-types'
import React from 'react'
import PoolDropdown from '../containers/pooldropdown'
import BlankStats from './blankstats'
import BlankGraph from './blankgraph'
import Graphs from '../containers/graphs'

class UnlockedWallet extends React.Component {

    constructor(props) {
        super(props)
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
        const { actions } = this.props
        actions.changeChartType(type)
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
        const { miningType, mining, chartType, balance } = this.props
        const accepted = this.getAcceptedSharesEfficiency()
        const rejected = accepted && (100 - accepted).toFixed(2) || 0
        const unpaidBalance = balance && balance.unpaid || 0

        return(
            <div className="content space-between">
                <div className="top-row">
                    <PoolDropdown />
                    <div className={`button miner-button ${mining ? "stop" : "start"}-button`} onClick={() => this.miningActionOnClick()}>
                        <div className="button-icon"></div>
                        <span>{mining ?  "Stop miner" : "Start miner" }</span>
                    </div>
                </div>
                <div className="data-cards">
                    <div className="item" disabled={ mining || chartType === 'hashrate' ? '' : 'disabled' } onClick={()=> this.changeChartType('hashrate')}>
                        {mining && <b>{this.getHashRateForDisplay()}</b> }
                        {!mining && <b>&#8211;</b> }
                        <small></small>
                        <span>Current hash rate</span>
                    </div>
                    <div className="item" hidden></div>
                    {miningType == 'pool' &&
                        <div className="item" disabled={ mining || chartType === 'shares' ? '' : 'disabled' } onClick={()=> this.changeChartType('shares')}>
                        {mining && (<div>
                            <b>{accepted}%</b>
                            <small className="red">{rejected}% rejected</small>
                        </div>)}
                        {!mining && (<div>
                            <b>&#8211;</b>
                            <small></small>
                        </div>)}
                            <span>Shares Efficiency</span>
                        </div>
                    }
                    {miningType == 'local' &&
                        <div hidden className="item" disabled={ chartType !== 'blocks' ? 'disabled' : '' }>
                            <b>1</b>
                            <small></small>
                            <span>Blocks Found</span>
                        </div>
                    }
                    <div className="item">
                        <div className="balance"><i className="fa fa-info-circle"></i>
                        <div className="info">
                            Minimum payout: 25 SEN
                            <br/>
                            Payout Frequency: 24hrs
                        </div>
                        </div>
                        <b>00000000000000 SEN</b>
                        <small></small>
                        <span>Unpaid balance</span>
                    </div>
                </div>
                <Graphs />
            </div>
        )
    }
}

UnlockedWallet.propTypes = {
    walletUnlocked: PropTypes.bool.isRequired,
    mining: PropTypes.bool.isRequired,
}

export default UnlockedWallet