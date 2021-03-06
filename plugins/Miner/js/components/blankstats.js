import React from 'react'

const BlankStats = () => {
    return(
        <div className="data-cards">
            <div className="item" disabled>
                <b>&#8211;</b>
                <small></small>
                <span>Current Hash Rate</span></div>
            <div className="item" disabled>
                <b>&#8211;</b>
                <small></small>
                <span>Pool Hash Rate</span>
            </div>
            <div className="item" disabled>
                <b><b>&#8211;</b></b>
                <small></small>
                <span>Shares Efficiency</span>
            </div>
            <div className="item" disabled>
                <b><span>&#8211;</span><span> SEN</span></b>
                <small></small>
                <span>Unpaid Balance</span>
            </div>
        </div>
    )
}

export default BlankStats