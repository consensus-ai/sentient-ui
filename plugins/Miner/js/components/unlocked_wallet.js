import React from 'react'
import PoolDropdown from '../containers/pooldropdown'
import { toast } from 'react-toastify'

const UnlockedWallet = () => {
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
    const startMinerOnClick = () => {
        toast.error("Wallet is locked. You must unlock it before mining", { autoClose: 7000 })
    }

    return(
        <div className="content space-between">
            <div className="top-row">
                <PoolDropdown />
                <div className="button miner-button start-button">
                    <div className="button-icon"></div>
                    <span>Start miner</span>
                </div>
            </div>
            <div className="data-cards">
                <div className="item">
                    <b>&#8211;</b>
                    <small></small>
                    <span>Current hash rate</span></div>
                <div className="item" hidden><b>58.4 GH/s</b>
                    <small></small>
                    <span>Pool hash rate</span></div>
                <div className="item" disabled>
                    <b>98.88%</b>
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
    )
}

export default UnlockedWallet