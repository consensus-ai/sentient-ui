import React from 'react'

const BlankGraph = () => {
    return(
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
    )
}

export default BlankGraph