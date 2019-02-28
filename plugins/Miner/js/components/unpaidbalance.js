import React from 'react'
const minimumPayout = 25

const UnpaidBalance = ({ balance, miningType }) => {

    const unpaidBalance = balance && balance.unpaid || 0.00
    let unpaidPercent = 100
    if (unpaidBalance < 25)
        unpaidPercent = (unpaidBalance * 100 / minimumPayout).toFixed(2)

    return(
        <div className="item" hidden={miningType === 'local'}>
            <b><span>{ unpaidBalance }</span> <span> SEN</span></b>
            <div className="progress">
                <div style={ {width: `${unpaidPercent}%`} }></div>
            </div>
            <span>Unpaid balance</span>
            <div className="description">
                <div>Minimum Payout: <b>{ minimumPayout } SEN</b></div>
                <div>Payout Frequency: <b>24 hrs</b></div>
                <div>Payout Minimum Progress: <b>{ unpaidPercent }%</b></div>
            </div>
        </div>
    )
}

export default UnpaidBalance
