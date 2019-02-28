import React from 'react'
import { toHumanSize } from '../sagas/helpers'

const HashRate = ({ hashRate, chartType, mining, actions }) => {

    const hashRateForDisplay = () => {
        const humanSize = toHumanSize(hashRate)
        return `${humanSize.hashrate} ${humanSize.unit}`
    }

    return(
        <div style={{cursor: 'pointer'}} className="item" disabled={ mining || chartType === 'hashrate' ? '' : 'disabled' } onClick={()=> actions.changeChartType('hashrate')}>
            {mining ? (<b>{ hashRateForDisplay() }</b>) : (<b>&#8211;</b>) }
            <small></small>
            <span>Current Hash Rate</span>
        </div>
    )
}

export default HashRate
