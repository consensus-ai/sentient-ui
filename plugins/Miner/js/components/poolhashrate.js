import React from 'react'
import { toHumanSize } from '../sagas/helpers'

const PoolHashRate = ({ poolHashRate, miningType }) => {

    const hashRateForDisplay = () => {
        const humanSize = toHumanSize(poolHashRate)
        return `${humanSize.hashrate} ${humanSize.unit}`
    }

    return(
        <div className="item" hidden={miningType === 'local'}>
            <b>{ hashRateForDisplay() }</b>
            <small></small>
            <span>Pool Hash Rate</span>
        </div>
    )
}

export default PoolHashRate
