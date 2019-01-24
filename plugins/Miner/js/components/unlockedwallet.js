import PropTypes from 'prop-types'
import React from 'react'
import PoolDropdown from '../containers/pooldropdown'
import UnpaidBalance from '../containers/unpaidbalance'
import PoolHashRate from '../containers/poolhashrate'
import Graphs from '../containers/graphs'
import { toHumanSize } from '../sagas/helpers'

const updateLocalHashrateInterval = 60000
const updatePoolHashrateInterval = 10000
const updateHashRateInterval = 2000

class UnlockedWallet extends React.Component {

    constructor(props) {
        super(props)
    }

    getHashRateForDisplay (value) {
        // need to use the same format for hashrates
        const humanSize = toHumanSize(value)
        return `${humanSize.hashrate} ${humanSize.unit}`
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
        const { mining, actions, miningpid, miningType } = this.props
        if (mining) {
            clearInterval(this.interval)
            clearInterval(this.hashRateInterval)
            actions.stopMiner(miningpid)
        } else {
            this.hashRateInterval = setInterval(() => {
                actions.getHashRate()
            }, updateHashRateInterval)
            if (miningType == 'pool') {
                this.changeChartType('hashrate')
                this.interval = setInterval(() => {
                    actions.getCurrentHashrate()
                }, updatePoolHashrateInterval)
            } else {
                setTimeout(() => actions.getCurrentHashrate(), 5000)
                this.interval = setInterval(() => {
                    actions.getCurrentHashrate()
                }, updateLocalHashrateInterval)
            }
            actions.startMiner()
        }
    }

    render () {
        const { miningType, mining, chartType, hashRate } = this.props
        const accepted = this.getAcceptedSharesEfficiency()
        const rejected = accepted && (100 - accepted).toFixed(2) || 0

        return(
            <div className="content space-between">
                <div className="top-row">
                    <PoolDropdown />
                    <div className={`button miner-button ${mining ? "stop" : "start"}-button`} onClick={() => this.miningActionOnClick()}>
                        <div className="button-icon"></div>
                        <span>{mining ?  "Stop Miner" : "Start Miner" }</span>
                    </div>
                </div>
                <div className="data-cards">
                    <div style={{cursor: 'pointer'}} className="item" disabled={ mining || chartType === 'hashrate' ? '' : 'disabled' } onClick={()=> this.changeChartType('hashrate')}>
                        {mining ? (<b>{this.getHashRateForDisplay(hashRate)}</b>) : (<b>&#8211;</b>) }
                        <small></small>
                        <span>Current Hash Rate</span>
                    </div>
                    <PoolHashRate />
                    {miningType == 'pool' &&
                        <div style={{cursor: 'pointer'}} className="item" disabled={ mining || chartType === 'shares' ? '' : 'disabled' } onClick={()=> this.changeChartType('shares')}>
                            { mining ? (
                                    <div>
                                        <b>{accepted}%</b>
                                        <small className="red">{rejected}% rejected</small>
                                    </div>
                                ) : (
                                    <div>
                                        <b>&#8211;</b>
                                        <small></small>
                                    </div>
                                )
                            }
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
                    <UnpaidBalance />
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