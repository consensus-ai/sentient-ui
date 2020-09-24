// Helper functions for the miner plugin.  Mostly used in sagas.
import request from 'request'

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

// Helper functions for the miner plugin.  Mostly used in sagas.

// offchainCall: promisify Offchain API calls.  Resolve the promise with `response` if the call was successful,
// otherwise reject the promise with `err`.
export const offchainCall = (endpoint, body) => new Promise((resolve, reject) => {
  const callOptions = {
    json: true,
    url: SentientAPI.config.offchain_api.url + endpoint,
    headers: {
      'User-Agent': 'Sentient-Agent',
    },
    agentOptions: {
      rejectUnauthorized: false
    },
    method: 'POST',
  }
  if (body) {
    callOptions.body = body
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
