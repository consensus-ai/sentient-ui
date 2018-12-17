// Helper functions for the miner plugin.  Mostly used in sagas.
import request from 'request'
const { spawn } = require('child_process')
import fs from 'graceful-fs'

let callOptions = {
  json: true,
  headers: {
    'User-Agent': 'Sentient-Agent',
  }
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
  callOptions.url = SentientAPI.config.sentient_miner.pool_host + url
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

// Start sentient-miner process and return PID
export const startMiningProcess = () => {
  const sentientConfig = SentientAPI.config
  const miningType = sentientConfig.attr('miningType')

  const minerSetting = {
    SENTIENT_MINER_HASHRATES_LOG_MAX_LINES: 259200, //1 month
    SENTIENT_MINER_HASHRATES_LOG_FREQUENCY: 5,
    SENTIENT_MINER_HASHRATES_LOG_PATH: sentientConfig.sentient_miner.hashrates_log_path
  }

  let args = ['-E=1,2']

  if (miningType === 'pool') {
    const payoutAddress = SentientAPI.config.attr('payoutAddress')
    args = args.concat([`-user=${payoutAddress}.sentientapp`, `-url=${sentientConfig.sentient_miner.stratum_host}`])
  } else {
    args = args.concat([`-url=${sentientConfig.sentientd.address}`])
  }

  const child = spawn(sentientConfig.sentient_miner.path, args, { stdio: 'ignore', env: minerSetting })
  return child.pid
}

// Format pool stats for graph
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

    while (endPeriod <= currentTime) {
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

// Collect hashrates by time
export const fetchHashrate = (timeOffset, fixedDuration) => {
  const startTime = Math.floor(timeOffset / fixedDuration) * fixedDuration
  const currentTime = Math.floor((Date.now() / 1000) / fixedDuration) * fixedDuration
  const hashRateData = fetchExisingData(startTime, fixedDuration)

  let endPeriod = startTime
  let resultHashRate = []

  if (Object.keys(hashRateData).length) {
      while (endPeriod <= currentTime) {
          let currentPeriod = hashRateData[endPeriod]
          if (currentPeriod) {
              let avg = currentPeriod['hashrate']/currentPeriod['count']
              resultHashRate.push({ hashrate: parseFloat(avg).toFixed(2), time: endPeriod })
          } else {
              resultHashRate.push({ hashrate: parseFloat(0).toFixed(2), time: endPeriod })
          }
          endPeriod = endPeriod + fixedDuration
      }
  }
  return resultHashRate
}

// Fetching history from log file
export const fetchExisingData = (startTime, fixedDuration) => {
  const logFilePath = SentientAPI.config.sentient_miner.hashrates_log_path
  const data = fs.readFileSync(logFilePath).toString().split("\n")
  const result = data.reduce((rv, line) => {
    let [timestamp, hashRate] = line.split(",")

    hashRate = parseFloat(hashRate)
    const groupTime = Math.floor(parseInt(timestamp) / fixedDuration) * fixedDuration
    if (groupTime >= startTime) {
      //group by minutes - round time to fixed period
      if (typeof rv[groupTime] === 'undefined') {
        rv[groupTime] = { count: 0, hashrate: 0 }
      }
      rv[groupTime]['count']++
      rv[groupTime]['hashrate'] = rv[groupTime]['hashrate'] + hashRate
    }
    return rv
  }, {})

  return result
}
