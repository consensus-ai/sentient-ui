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
            <div className="balance-info-container">
                <div className="balance-info">
                    <div className="balance-info-icon balance-info-synced-icon" title=""></div>
                    <div className="balance-info-amount-container" title="0 SEN pending"><span
                        className="balance-info-amount">{formattedConfirmedBalance}</span><span className="balance-info-currency">SEN</span></div>
                </div>
            </div>

            <div className="content space-between">

                <div className="top-row">
                    <PoolDropdownView />
                    <div className="button miner-button stop-button">
                        <div className="button-icon"></div>
                        <span>Start miner</span>
                    </div>

                </div>
                <div className="data-cards">
                    <div className="item"><b>&#8211;</b>
                        <small></small>
                        <span>Current hash rate</span></div>
                    <div className="item" hidden><b>58.4 GH/s</b>
                        <small></small>
                        <span>Pool hash rate</span></div>
                    <div className="item" disabled><b>98.88%</b>
                        <small className="red">1.12% rejected</small>
                        <span>Shares</span></div>
                    <div className="item">
                        <div className="balance"><i className="fa fa-info-circle"></i>
                            <div className="info">Minimum payout: 0.1 SEN</div>
                        </div>
                        <b>500 SEN</b>
                        <small></small>
                        <span>Unpaid balance</span></div>
                </div>
                <div className="graph">
                    <div className="wrap"></div>
                    <div className="footer">
                        <span>Shares this session</span>
                        <ul>
                            <li>24 hours</li>
                            <li className="active">3 days</li>
                            <li>1 week</li>
                            <li>1 month</li>
                        </ul>
                    </div>
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
