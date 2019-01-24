import React from 'react'

const BlankStats = () => {
    return(
        <div className="data-cards">
            <div className="item" disabled>
                <b>&#8211;</b>
                <small></small>
                <span>Current hash rate</span></div>
            <div className="item" hidden></div>
            <div className="item" disabled>
                <b><b>&#8211;</b></b>
                <small></small>
                <span>Shares Efficiency</span>
            </div>
            <div className="item" disabled>
                <b><span>&#8211;</span><span> SEN</span></b>
                <div className="progress">
                    <div style="width:35%;"></div>
                </div>
                <span>Unpaid balance</span>

                <div className="description">
                    <div>Minimum Payout: <b>25 SEN</b></div>
                    <div>Payout Frequency: <b>24 hrs</b></div>
                    <div>Payout Minimum Progress: <b>25.3%</b></div>
                </div>
            </div>
        </div>
    )
}

export default BlankStats