import PropTypes from 'prop-types'
import React from 'react'

import {ToastContainer, Slide} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Miner = ({walletLocked, miningStatus, actions}) => {
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

                <div className="wallet"><b>1,500</b> SEN</div>

                {walletLocked &&
                <div className="top-row">
                    <div className="exclamation"><i className="fa fa-exclamation-triangle"></i> Wallet is locked. You
                        must
                        unlock it before mining
                    </div>
                    <div className="dropdown">
                        <span>Local Daemon <i className="fa fa-angle-down"></i></span>
                        <ul>
                            <li>Pool</li>
                            <li>Local Daemon</li>
                        </ul>
                    </div>
                </div>
                }

                {!walletLocked &&

                <div className="data-cards">
                    <div className="item" passive>
                        <b>-</b>
                        <small></small>
                        <span>Current hash rate</span>
                    </div>
                    <div className="item" passive>
                        <b>58.4 GH/s</b>
                        <small></small>
                        <span>Pool hash rate</span>
                    </div>
                    <div className="item">
                        <b>98.88%</b>
                        <small>1.12% rejected</small>
                        <span>Shares</span>
                    </div>
                    <div className="item" passive>

                        <div className="balance">
                            <i className="fa fa-info-circle"></i>
                            <div className="info">Minimum payout: 0.1 SEN</div>
                        </div>

                        <b>500 SEN</b>
                        <small></small>
                        <span>Unpaid balance</span>
                    </div>
                </div>

                }


                {!walletLocked &&

                <div className="graph">
                    <img src="assets/Graph.svg" />
                </div>


                }

            </div>
        </div>
    )
}

Miner.propTypes = {
    walletLocked: PropTypes.bool.isRequired,
    miningStatus: PropTypes.object.isRequired,
}

export default Miner
