// Helper functions for the miner plugin.  Mostly used in sagas.

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
