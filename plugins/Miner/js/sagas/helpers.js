// Helper functions for the miner plugin.  Mostly used in sagas.
import request from 'request'
const { spawn } = require('child_process')

// units: Constant for converting hashrates
const units = {
  'MH/s': 1000 * 1000 * 1000,
  'GH/s': 1000 * 1000 * 1000 * 1000,
  'TH/s': 1000 * 1000 * 1000 * 1000 * 1000,
  'PH/s': 1000 * 1000 * 1000 * 1000 * 1000 * 1000,
  'EH/s': 1000 * 1000 * 1000 * 1000 * 1000 * 1000 * 1000,
}

// sentientdCall: promisify Sentientd API calls.  Resolve the promise with `response` if the call was successful,
// otherwise reject the promise with `err`.
export const sentientdCall = (uri) => new Promise((resolve, reject) => {
  SentientAPI.call(uri, (err, response) => {
    if (err) {
      reject(err)
    } else {
      resolve(response)
    }
  })
})

// poolServerCall: promisify PoolServer API calls.  Resolve the promise with `response` if the call was successful,
// otherwise reject the promise with `err`.
export const poolServerCall = (url) => new Promise((resolve, reject) => {
  let callOptions = {
    json: true,
    url: SentientAPI.config.sentient_miner.pool_host + url,
    headers: {
      'User-Agent': 'Sentient-Agent',
    }
  }
  console.log(`request: ${callOptions.url}`)
  request(callOptions, (err, res, body) => {
		if (!err && (res.statusCode < 200 || res.statusCode > 299)) {
			reject(body)
		} else if (!err) {
			resolve(body)
		} else {
			reject(err)
		}
	})
})

// getHashRate: Call local API for getting hastare
export const getHashRate = () => new Promise((resolve, reject) => {
  let callOptions = {
    json: true,
    url: SentientAPI.config.sentient_miner.hashrate_host,
  }
  request(callOptions, (err, res, body) => {
		if (!err) {
			resolve(body)
		} else {
			reject(err)
		}
	})
})


// startMiningProcess: Start sentient-miner process and return PID
export const startMiningProcess = () => {
  const sentientConfig = SentientAPI.config
  const miningType = sentientConfig.attr('miningType')

  let args = ['-I=18']

  if (miningType === 'pool') {
    const minerName = sentientConfig.attr('minerName')
    const payoutAddress = sentientConfig.attr('payoutAddress')
    args = args.concat([`-user=${payoutAddress}.${minerName}`, `-url=${sentientConfig.sentient_miner.stratum_host}`])
  }

  const child = spawn(sentientConfig.sentient_miner.path, args, { stdio: 'ignore' })
  return child
}

// formatHistory: Format pool stats for graph
export const formatHistory = (data, timeOffset, fixedDuration) => {
  const currentTime = Math.floor((Date.now() / 1000) / fixedDuration) * fixedDuration
  const startTime = Math.floor(timeOffset / fixedDuration) * fixedDuration
  let endPeriod = startTime
  let result = []
  if(data.length) {
    const formatedData = data.reduce((rv, stats) => {
      let [time, submitted, accepted, stale] = stats
      let acceptedOffset = accepted - rv["prev_accepted"]
      let submittedOffset = submitted - rv["prev_submitted"]
      let accepted_percent = (acceptedOffset * 100 / submittedOffset).toFixed(2)
      rv[time] = {
        time: time,
        accepted: accepted_percent,
        rejected: (100 - accepted_percent).toFixed(2),
        baraccepted: acceptedOffset,
        barrejected: (submittedOffset - acceptedOffset)
      }
      rv["prev_accepted"] = accepted
      rv["prev_submitted"] = submitted
      return rv
    }, {prev_accepted: 0, prev_submitted: 0})

    while (endPeriod < currentTime) {
      let currentPeriod = formatedData[endPeriod]
      if (!currentPeriod) {
        result.push({ time: endPeriod, accepted: 0, rejected: 0 })
      } else {
        result.push(currentPeriod)
      }
      endPeriod = endPeriod + fixedDuration
    }
  }
  return result
}

// formatHashrate: Format hashrates for graph
export const formatHashrate = (data, timeOffset, fixedDuration) => {
  const currentTime = Math.floor((Date.now() / 1000) / fixedDuration) * fixedDuration
  const startTime = Math.floor(timeOffset / fixedDuration) * fixedDuration
  let endPeriod = startTime
  let result = []
  if(data.length) {
    const formatedData = data.reduce((rv, hashrates) => {
      let [time, hashrate] = hashrates
      rv[time] = Object.assign({time: time}, toHumanSize(hashrate))
      return rv
    },{})
    while (endPeriod < currentTime) {
      let currentPeriod = formatedData[endPeriod]
      if (currentPeriod) {
        result.push(currentPeriod)
      } else {
        result.push({ orighashrate: parseFloat(0).toFixed(2), time: endPeriod })
      }
      endPeriod = endPeriod + fixedDuration
    }
  }
  return result
}

// toHumanSize: Foramt hashrate to human readeble
export const toHumanSize = (hashrate) => {
  let unit
  let denominator
  let BreakException = {}
  try {
      Object.keys(units).forEach((value) => {
        denominator = units[value]
        unit = value
        if (hashrate < denominator) {
            throw BreakException
        }
      })
  } catch (e) {
      if (e !== BreakException) throw e
  }
  return {
    hashrate: (parseFloat(hashrate) / (denominator / 1000)).toFixed(2),
    orighashrate: (parseFloat(hashrate) / 1000000).toFixed(2),
    unit: unit
  }
}