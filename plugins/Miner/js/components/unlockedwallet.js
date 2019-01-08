import PropTypes from 'prop-types'
import React from 'react'
import PoolDropdown from '../containers/pooldropdown'
import Graphs from '../containers/graphs'
import { toHumanSize } from '../sagas/helpers'

const updateLocalHashrateInterval = 60000
const updatePoolHashrateInterval = 10000

class UnlockedWallet extends React.Component {

    constructor(props) {
        super(props)
    }

    getHashRateForDisplay () {
        const { hashRate } = this.props
        if (hashRate === '0.00 MH/s') {
            return hashRate
        } else {
            // need to use the same format for hashrates
            const humanSize = toHumanSize(hashRate)
            return `${humanSize.hashrate} ${humanSize.unit}`
        }
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
            actions.stopMiner(miningpid)
        } else {
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
                    <div style={{cursor: 'pointer'}} className="item" disabled={ mining || chartType === 'hashrate' ? '' : 'disabled' } onClick={()=> this.changeChartType('hashrate')}>
                        {mining ? (<b>{this.getHashRateForDisplay()}</b>) : (<b>&#8211;</b>) }
                        <small></small>
                        <span>Current hash rate</span>
                    </div>
                    <div className="item" hidden></div>
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
                    <div className="item" hidden={miningType === 'local'}>
                        <div className="balance"><i className="fa fa-info-circle"></i>
                        <div className="info">
                            Minimum payout: 25 SEN
                            <br/>
                            Payout Frequency: 24hrs
                        </div>
                        </div>
                        <b><span>{ unpaidBalance }</span> <span> SEN</span></b>
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
    balance: PropTypes.object.isRequired,
}

export default UnlockedWallet