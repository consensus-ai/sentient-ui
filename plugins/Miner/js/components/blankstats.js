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
                <div className="balance">
                    <i className="fa fa-info-circle"></i>
                    <div className="info">
                        Minimum payout: 25 SEN
                        <br/>
                        Payout Frequency: 24hrs
                    </div>
                </div>
                <b><span>&#8211;</span><span> SEN</span></b>
                <small></small>
                <span>Unpaid balance</span>
            </div>
        </div>
    )
}

export default BlankStats