import React from 'react'

import HashRateGraph from './hashrategraph'
import { toHumanSize } from '../sagas/helpers'

const CurrentHashRateGraph = ({currentHashrate}) => {
  const fillData = () => {
    let result = []
    let currentTime = Math.floor(Date.now() / 1000)
    let endPeriod = currentTime - 4 * 60 * 60
    let hashrateTime = currentHashrate.length && currentHashrate[0].time
    if (!hashrateTime) {
      return result
    }
    while (endPeriod < hashrateTime) {
      result.push({ orighashrate: parseFloat(0).toFixed(2), time: endPeriod })
      endPeriod = endPeriod + 60
    }
    if (currentHashrate.length > 0) {
      currentHashrate.forEach((el) => {
        result.push(Object.assign({time: el.time}, toHumanSize(el.hashrate)))
      })
    }
    return result
  }

  return(
    <HashRateGraph hashrateHistory={fillData()} />
  )
}

export default CurrentHashRateGraph
