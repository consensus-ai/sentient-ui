import PropTypes from 'prop-types'
import React from 'react'

import {ToastContainer, Slide} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import PoolDropdownView from './pool_dropdown'

const Miner = ({walletLocked, miningStatus, confirmedBalance, synced, actions}) => {
    let formattedConfirmedBalance = confirmedBalance.replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
    const getHashRateForDisplay = () => {
        if (!miningStatus.cpumining) {
            return "0 KH/s"
        }
        return (miningStatus.cpuhashrate / 1000).toFixed(2) + " KH/s"
    }

    const miningActionOnClick = (e) => {
        if (miningStatus.cpumining) {
            actions.stopMiner()
        } else {
            actions.startMiner()
        }
    }

    return (
        <div className="miner">
            <div className="content space-between">

                <div className="wallet"><b>{formattedConfirmedBalance}</b> SEN</div>
                <div className="top-row">
                    <div className="exclamation" style={walletLocked ? {} : {display: "none"}}><i className="fa fa-exclamation-triangle"></i>
                        Wallet is locked. You must unlock it before mining
                    </div>
                    <PoolDropdownView />
                </div>
                <div className="data-cards">
                    <div className="item">
                        <b>-</b>
                        <small></small>
                        <span>Current hash rate</span>
                    </div>
                    <div className="item">
                        <b>58.4 GH/s</b>
                        <small></small>
                        <span>Pool hash rate</span>
                    </div>
                    <div className="item">
                        <b>98.88%</b>
                        <small>1.12% rejected</small>
                        <span>Shares</span>
                    </div>
                    <div className="item">
                        <div className="balance">
                            <i className="fa fa-info-circle"></i>
                            <div className="info">Minimum payout: 0.1 SEN</div>
                        </div>

                        <b>500 SEN</b>
                        <small></small>
                        <span>Unpaid balance</span>
                    </div>
                </div>
                <div className="graph">
                    <img src="assets/Graph.svg" />
                </div>
            </div>
        </div>
    )
}

Miner.propTypes = {
    confirmedBalance: PropTypes.string.isRequired,
    synced: PropTypes.bool.isRequired,
    walletLocked: PropTypes.bool.isRequired,
    miningStatus: PropTypes.object.isRequired,
}

export default Miner
