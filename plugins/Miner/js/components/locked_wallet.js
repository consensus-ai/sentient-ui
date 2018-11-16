import React from 'react'
import PoolDropdown from '../containers/pooldropdown'
import { toast } from 'react-toastify'

const LockedWallet = ({walletUnlocked, actions}) => {
    const startMinerOnClick = () => {
        toast.error("Wallet is locked. You must unlock it before mining", { autoClose: 7000 })
    }

    return(
        <div className="content space-between">
            <div className="top-row">
                <PoolDropdown />
                <div className="button miner-button start-button" onClick={startMinerOnClick}>
                    <div className="button-icon"></div>
                    <span>Start miner</span>
                </div>
            </div>
            <div className="data-cards">
                <div className="item" disabled>
                    <b>&#8211;</b>
                    <small></small>
                    <span>Current hash rate</span></div>
                <div className="item" hidden></div>
                <div className="item" disabled>
                    <b><b>&#8211;</b></b>
                    <small></small>
                    <span>Shares</span>
                </div>
                <div className="item" disabled>
                    <div className="balance">
                        <i className="fa fa-info-circle"></i>
                        <div className="info">Minimum payout: 0.1 SEN</div>
                    </div>
                    <b>&#8211;</b>
                    <small></small>
                    <span>Unpaid balance</span>
                </div>
            </div>
            <div className="graph">
                <div className="wrap"></div>
                <div className="footer">
                    <span>Shares this session</span>
                    <ul>
                        <li>24 hours</li>
                        <li>3 days</li>
                        <li>1 week</li>
                        <li>1 month</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default LockedWallet