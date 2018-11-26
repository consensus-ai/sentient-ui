// Helper functions for the miner plugin.  Mostly used in sagas.
import request from 'request'
const { spawn } = require('child_process')
const poolBaseUrl = 'http://pool.sentient.org'
let callOptions = {}
callOptions.url = poolBaseUrl
callOptions.json = true
callOptions.headers = {
  'User-Agent': 'Sentient-Agent',
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
  callOptions.url = callOptions.url + url
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
  const miningType = SentientAPI.config.attr('miningType')
  const sentientConfig = SentientAPI.config.sentientd
  const minerSetting = {
    SENTIENT_MINER_HASHRATES_LOG_MAX_LINES: 260000, //1 month
    SENTIENT_MINER_HASHRATES_LOG_FREQUENCY: 5,
    SENTIENT_MINER_HASHRATES_LOG_PATH: `${sentientConfig.datadir}/hashrates.log`
  }

  let args = ['-E=1,2']

  if (miningType === 'pool') {
    const payoutAddress = SentientAPI.config.attr('payoutAddress')
    args = args.concat([`-user=${payoutAddress}.sentientapp`, "-url=stratum+tcp://pool.sentient.org:3333"])
  } else {
    args = args.concat([`-url=${sentientConfig.address}`])
  }

  const child = spawn('/Users/alexander/Downloads/sentient-miner-0.1.1-osx-amd64', args, { stdio: 'ignore', env: minerSetting })
  return child.pid
}
