import React from 'react'

import HashRateGraph from './hashrategraph'
import { toHumanSize } from '../sagas/helpers'

const CurrentHashRateGraph = ({currentHashrate, offset, interval, mining}) => {
  const fillData = () => {
    let result = []
    let currentTime = Math.floor(Date.now() / 1000)
    let endPeriod = currentTime - offset
    let hashrateTime = currentHashrate.length && currentHashrate[0].time
    if (!hashrateTime) {
      return result
    }
    let count = offset / interval

    while (endPeriod < hashrateTime) {
      result.push({ orighashrate: parseFloat(0).toFixed(2), time: endPeriod })
      endPeriod = endPeriod + interval
    }
    currentHashrate.forEach((el) => {
      result.push(Object.assign({time: el.time}, toHumanSize(el.hashrate)))
    })

    if (currentHashrate.length > count) {
      currentHashrate.shift()
    }
    return result
  }

  return(
    <HashRateGraph hashrateHistory={fillData()} mining={mining} />
  )
}

export default CurrentHashRateGraph
