import React from 'react'
import PoolDropdown from '../containers/pooldropdown'
import BlankStats from './blankstats'
import BlankGrapf from './blankgraph'
import { toast } from 'react-toastify'

const LockedWallet = () => {
    const startMinerOnClick = () => {
        toast.error("Wallet is locked. You must unlock it before mining", { autoClose: 7000 })
    }

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
                <div className="button miner-button start-button" onClick={startMinerOnClick}>
                    <div className="button-icon"></div>
                    <span>Start Miner</span>
                </div>
            </div>
            <BlankStats />
            <BlankGrapf />
        </div>
    )
}

export default LockedWallet