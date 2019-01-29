import PropTypes from 'prop-types'
import React from 'react'
import PoolDropdown from '../containers/pooldropdown'
import UnpaidBalance from '../containers/unpaidbalance'
import PoolHashRate from '../containers/poolhashrate'
import HashRate from '../containers/hashrate'
import PoolStats from '../containers/poolstats'
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
                actions.changeChartType('hashrate')
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
        const { mining } = this.props

        return(
            <div className="content space-between">
                <div className="top-row">

                    <div className="intensity">
                        <div className="label">Intencity</div>
                        <div className="range-slider">
                            <input type={'range'} min={'1'} max={'30'} value={'16'}/>
                        </div>
                        <div className="value">16</div>
                    </div>

                    <PoolDropdown />
                    <div className={`button miner-button ${mining ? "stop" : "start"}-button`} onClick={() => this.miningActionOnClick()}>
                        <div className="button-icon"></div>
                        <span>{mining ?  "Stop Miner" : "Start Miner" }</span>
                    </div>
                </div>
                <div className="data-cards">
                    <HashRate />
                    <PoolHashRate />
                    <PoolStats />
                    <UnpaidBalance />
                </div>
                <Graphs />
            </div>
        )
    }
}

UnlockedWallet.propTypes = {
    mining: PropTypes.bool.isRequired,
}

export default UnlockedWallet