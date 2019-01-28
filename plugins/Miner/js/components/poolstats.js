import React from 'react'

const PoolStats = ({ miningType, chartType, mining, sharesEfficiency, actions }) => {

    let { accepted, submitted } = sharesEfficiency
    accepted = submitted && (accepted * 100 / submitted).toFixed(2) || 0
    const rejected = accepted && (100 - accepted).toFixed(2) || 0

    return(
        <div style={{cursor: 'pointer'}} hidden={miningType === 'pool' ? '' : 'hidden'} className="item" disabled={ mining || chartType === 'shares' ? '' : 'disabled' } onClick={()=> actions.changeChartType('shares')}>
            { mining ? (
                    <div>
                        <b>{accepted}%</b>
                        <small className="red">{rejected}% rejected</small>
                    </div>
                ) : (
                    <div>
                        <b>&#8211;</b>
                        <small></small>
                    </div>
                )
            }
            <span>Shares Efficiency</span>
        </div>
    )
}

export default PoolStats
